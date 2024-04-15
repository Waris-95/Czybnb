const express = require("express");
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const {
    Review,
    Spot,
    SpotImage,
    User,
    ReviewImage,
} = require("../../db/models");

const router = express.Router();

// Get all reviews by currently logged in user
router.get("/current", requireAuth, async (req, res, next) => {
    try {
      const reviews = await Review.findAll({
        where: { userId: req.user.id },
        include: [
          {
            model: User,
            as: "User",
            attributes: ["id", "firstName", "lastName"], // Include first name of the reviewer
          },
          {
            model: Spot,
            as: "Spot",
            attributes: {
              exclude: ["createdAt", "updatedAt", "description"],
            },
            include: [{ model: SpotImage, as: "SpotImages" }],
          },
          { model: ReviewImage, attributes: ["id", "url"] },
        ],
      });
  
      const formattedReviews = reviews.map((review) => {
        const formattedReview = review.toJSON();
        formattedReview.Spot.SpotImages.forEach((spotImage) => {
          if (spotImage.preview === true) {
            formattedReview.Spot.previewImage = spotImage.url;
          }
        });
        if (!formattedReview.Spot.previewImage) {
          formattedReview.Spot.previewImage = "No preview image found";
        }
  
        // Format review date (assuming review.createdAt is the date property)
        const reviewDate = new Date(formattedReview.createdAt);
        const monthYear = reviewDate.toLocaleString("en-US", {
          month: "long",
          year: "numeric",
        });
        formattedReview.reviewDate = monthYear;
  
        // Include reviewer's first name
        formattedReview.reviewerFirstName = review.User.firstName;
  
        // Include review comment text
        formattedReview.reviewText = formattedReview.review;
  
        // Remove unnecessary properties
        delete formattedReview.createdAt;
        delete formattedReview.updatedAt;
        delete formattedReview.Spot.SpotImages;
        delete formattedReview.review;
  
        return formattedReview;
      });
  
      res.json({ Reviews: formattedReviews });
    } catch (error) {
      next(error);
    }
  });
  


// Add an image to a review based on review id
router.post("/:reviewId/images", requireAuth, async (req, res, next) => {
  const review = await Review.findByPk(req.params.reviewId);
  const reviewImages = await ReviewImage.findAll({
      where: { reviewId: req.params.reviewId },
  });

  if (review) {
      if (review.userId === req.user.id) {
          if (reviewImages.length >= 10) {
              // If the number of images for the review has reached the maximum limit, return a Forbidden error
              res.status(403).json({
                message: 'Maximum number of images for this resource was reached',
              });
              return 
          }

          const { url } = req.body;

          const newImage = await ReviewImage.create({
              reviewId: parseInt(req.params.reviewId),
              url,
          });

          const data = newImage.toJSON();

          delete data.reviewId;
          delete data.updatedAt;
          delete data.createdAt;

          return res.json(data);
      } else {
          // If the authenticated user is not the creator of the review, return a Forbidden error
          return res.status(403).json({
            message: 'Forbidden',
          });
      }
  }

  // If the review is not found, return a Not Found error
  return res.status(404).json({
    message: "Review couldn't be found",
  });
});

const validateReview = [
    check("review")
        .exists({ checkFalsy: true })
        .withMessage("Review text is required"),
    check("stars")
        .exists({ checkFalsy: true })
        .custom((value) => {
            return parseInt(value) < 6 && parseInt(value) > 0;
        })
        .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors,
    requireAuth,
];

// Edit an existing review
router.put("/:reviewId", requireAuth, validateReview, async (req, res, next) => {
    const thisReview = await Review.findByPk(req.params.reviewId);
  
    if (thisReview) {
        if (req.user.id === thisReview.userId) {
            const { review, stars } = req.body;
  
            thisReview.review = review;
            thisReview.stars = stars;
  
            thisReview.save();
  
            return res.json(thisReview);
        } else {
           return res.status(403).json({
            message: "Forbidden",
           });
        }
    }
  
    // Return a 404 response if the review couldn't be found
    return res.status(404).json({
      message: "Review couldn't be found",
    //   { message: "Review couldn't be found" }
    });
  });
  



// Delete a review
router.delete("/:reviewId", requireAuth, async (req, res, next) => {
    const review = await Review.findByPk(req.params.reviewId);

    if (review) {
        if (req.user.id === review.userId) {
             await review.destroy(); // Corrected line

            return res.json({ message: "Successfully deleted" });
        } else {
          return res.status(403).json({
            message: "Forbidden",  
          });
        }
    }

    return res.status(404).json({
        message: "Review couldn't be found",
    });
});

module.exports = router;
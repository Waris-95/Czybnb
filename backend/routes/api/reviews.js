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
              as: 'User', // Specify the alias for the User model
              attributes: ["id", "firstName", "lastName"] 
          },
          {
              model: Spot,
              as: 'Spot', // Specify the alias for the Spot model
              attributes: {
                  exclude: ["createdAt", "updatedAt", "description"],
              },
              include: [{ 
                  model: SpotImage,
                  as: 'SpotImages' // Specify the alias for the SpotImage model
              }],
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
          delete formattedReview.Spot.SpotImages;
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
          const err = new Error("Forbidden");
          err.title = "Forbidden";
          err.errors = { message: "Not authorized to take this action" };
          err.status = 403;
          return next(err);
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
            const err = new Error("Forbidden");
            err.title = "Forbidden";
            err.errors = { message: "Not authorized to take this action" };
            err.status = 403;
            return next(err);
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
            const err = new Error("Forbidden");
            err.title = "Forbidden";
            err.errors = { message: "Not authorized to take this action" };
            err.status = 403;
            return next(err);
        }
    }

    const err = new Error("Review couldn't be found");
    err.title = "Review couldn't be found";
    err.errors = { message: "Review couldn't be found" };
    err.status = 404;
    return next(err);
});

module.exports = router;
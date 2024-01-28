const express = require("express");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User, Spot, SpotImage, Review, ReviewImage, Booking } = require("../../db/models");
const router = express.Router();

/**
 * Get all reviews of the current user
 * Route: GET /current
 * Requires authentication.
 */
router.get("/current", requireAuth, async (req, res, next) => {
  try {
    // Destructure the user from the request
    const { user } = req;

    // Retrieve all reviews of the current user with associated data
    const allReviews = await Review.findAll({
      where: {
        userId: user.id,
      },
      include: [
        // Include User model with selected attributes
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
        },
        // Include Spot model with selected attributes and SpotImage model
        {
          model: Spot,
          attributes: [
            "id",
            "ownerId",
            "address",
            "city",
            "state",
            "country",
            "lat",
            "lng",
            "name",
            "price",
          ],
          include: [
            {
              model: SpotImage,
            },
          ],
        },
        // Include ReviewImage model with selected attributes
        {
          model: ReviewImage,
          attributes: ["id", "url"],
        },
      ],
    });
    // Format reviews data
    const formattedReviews = allReviews.map((review) => {
      const formattedReview = review.toJSON();
      // Extract SpotImages from Spot and set previewImage
      const spotImages = formattedReview.Spot?.SpotImages || [];
      formattedReview.Spot.previewImage = spotImages.length > 0 ? spotImages[0].url : null;
      delete formattedReview.Spot.SpotImages;

    //   console.log(formattedReview);
      return formattedReview;
    
    });
    // Respond with the formatted reviews
    return res.status(200).json({ Reviews: formattedReviews });
  } catch (error) {
    next(error);
  }
});

// Add an image to a review based on the review's ID
router.post("/:reviewId/images", requireAuth, async (req, res, next) => {
    // Extract necessary information from the request
    const { url } = req.body;  
    const { user } = req;

    try {
        // Find the review by its ID
        const review = await Review.findByPk(req.params.reviewId);
        // Check if the review exists and belongs to the authenticated user
        if (!review || review.userId !== user.id) {
            return res.status(404).json({ message: "Review couldn't be found" });
        }
        // Retrieve all images associated with the review
        const allImages = await ReviewImage.findAll({
            where: {
                reviewId: req.params.reviewId,
            },
        });
        // Check if the maximum number of images has been reached
        if (allImages.length < 10) {
            // Create a new image for the review
            const image = await ReviewImage.create({
                reviewId: req.params.reviewId,
                url: url,
            });
            // Return the newly created image details
            return res.json({ id: image.id, url });
        } else {
            // Return an error if the maximum number of images has been reached
            return res.status(403).json({
                message: "Maximum number of images for this resource was reached",
            });
        }
    } catch (error) {
        // Pass any errors to the error handling middleware
        next(error);
    }
});


module.exports = router;

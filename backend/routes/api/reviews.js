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

      return formattedReview;
    });
    // Respond with the formatted reviews
    return res.status(200).json({ Reviews: formattedReviews });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

const express = require("express");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const {User,Spot,SpotImage,Review,sequelize,ReviewImage,Booking} = require("../../db/models");
const router = express.Router();
// Get all review of the current user
router.get("/current", requireAuth, async (req, res, next) => {
  const { user } = req;
  try {
    const allReviews = await Review.findAll({
      where: {
        userId: user.id,
      },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
        },
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
        {
          model: ReviewImage,
          attributes: ["id", "url"],
        },
      ],
    });

    const formattedReviews = allReviews.map((review) => {
      const formattedReview = review.toJSON();

      const spotImages = formattedReview.Spot.SpotImages;
      formattedReview.Spot.previewImage =
        spotImages.length > 0 ? spotImages[0].url : null;
      delete formattedReview.Spot.SpotImages;

      return formattedReview;
    });

    return res.status(200).json({ Reviews: formattedReviews });
  } catch (error) {
    next(error);
  }
});


module.exports = router;
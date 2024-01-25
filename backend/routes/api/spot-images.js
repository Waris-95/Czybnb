const express = require("express");
const { requireAuth } = require("../../utils/auth");

const { Spot, SpotImage, User, ReviewImage, Review } = require("../../db/models");

const router = express.Router();

// Delete a spot image
router.delete("/api/spot-images/:imageId", requireAuth, async (req, res, next) => {
    try {
        const spotImage = await SpotImage.findByPk(req.params.imageId, {
            include: Spot,
        });

        if (spotImage) {
            if (req.user.id === spotImage.Spot.ownerId) {
                await spotImage.destroy();
                return res.status(200).json({ message: "Successfully deleted" });
            } else {
                return res.status(403).json({ message: "Not authorized to take this action" });
            }
        } else {
            return res.status(404).json({ message: "Spot Image couldn't be found" });
        }
    } catch (error) {
        console.error(error);
        const err = new Error("Internal Server Error");
        err.title = "Internal Server Error";
        err.errors = { message: "Internal Server Error" };
        err.status = 500;
        return next(err);
    }
});

// Delete a review image
router.delete("/api/review-images/:imageId", requireAuth, async (req, res, next) => {
    try {
        const reviewImage = await ReviewImage.findByPk(req.params.imageId, {
            include: Review,
        });

        if (reviewImage) {
            if (req.user.id === reviewImage.Review.userId) {
                await reviewImage.destroy();
                return res.status(200).json({ message: "Successfully deleted" });
            } else {
                return res.status(403).json({ message: "Not authorized to take this action" });
            }
        } else {
            return res.status(404).json({ message: "Review Image couldn't be found" });
        }
    } catch (error) {
        console.error(error);
        const err = new Error("Internal Server Error");
        err.title = "Internal Server Error";
        err.errors = { message: "Internal Server Error" };
        err.status = 500;
        return next(err);
    }
});

module.exports = router;

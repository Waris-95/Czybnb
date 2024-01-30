const express = require("express");
const { requireAuth } = require("../../utils/auth");
const router = express.Router();
const { Op } = require("sequelize");
const { Review, ReviewImage } = require("../../db/models");

// DELETE endpoint for deleting a review image
router.delete("/:imageId", requireAuth, async (req, res, next) => {
    const { user } = req; // Extract user from request

    try {
        // Find the review image by its primary key, including associated review
        const reviewImage = await ReviewImage.findByPk(req.params.imageId, {
            include: {
                model: Review, // Include associated review for additional checks
            },
        });

        // Check if the review image exists or if it doesn't belong to the authenticated user
        if (!reviewImage || reviewImage.Review.userId !== user.id) {
            return res.status(404).json({ message: "Review Image couldn't be found" });
        }

        // Delete the review image from the database
        await reviewImage.destroy();

        // Return success message
        return res.status(200).json({ message: "Successfully deleted" });
    } catch (error) {
        // Pass the error to the error-handling middleware
        next(error);
    }
});

module.exports = router;

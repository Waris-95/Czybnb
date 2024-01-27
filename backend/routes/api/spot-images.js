const express = require("express");
const { requireAuth } = require("../../utils/auth");
const { SpotImage, Spot } = require("../../db/models");

const router = express.Router();

// DELETE a spot image
router.delete("/:imageId", requireAuth, async (req, res, next) => {
    try {
        // Find the spot image by ID, including the associated Spot
        const spotImage = await SpotImage.findByPk(req.params.imageId, {
            include: Spot,
        });

        // Check if the spot image exists
        if (spotImage) {
            // Check if the authenticated user is the owner of the spot
            if (req.user.id === spotImage.Spot.ownerId) {
                // Delete the spot image
                await spotImage.destroy();
                return res.status(200).json({ message: "Successfully deleted" });
            } else {
                // If the user is not the owner, return a 403 Forbidden status
                return res.status(403).json({ message: "Not authorized to take this action" });
            }
        } else {
            // If the spot image is not found, return a 404 Not Found status
            return res.status(404).json({ message: "Spot Image couldn't be found" });
        }
    } catch (error) {
        // Handle internal server error
        console.error(error);

        // Create a custom error object with a meaningful title and status
        const err = new Error("Internal Server Error");
        err.title = "Internal Server Error";
        err.errors = { message: "Internal Server Error" };
        err.status = 500;

        // Pass the error to the error-handling middleware
        return next(err);
    }
});

module.exports = router;

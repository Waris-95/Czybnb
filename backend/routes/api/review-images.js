const express = require("express");
const { requireAuth } = require("../../utils/auth");

const { Review, Spot, User, ReviewImage } = require("../../db/models");

const router = express.Router();

// Delete a review image
router.delete("/:imageId", requireAuth, async (req, res, next) => {
    const image = await ReviewImage.unscoped().findByPk(req.params.imageId);
    if (image) {
        const review = await Review.findByPk(image.reviewId);
        if (req.user.id === review.userId) {
            image.destroy();
            return res.json({ message: "Succesfully deleted" });
        } else {
            const err = new Error("Forbidden");
            err.title = "Forbidden";
            err.errors = { message: "Not authorized to take this action" };
            err.status = 403;
            return next(err);
        }
    }

    const err = new Error("Review image couldn't be found");
    err.title = "Review image couldn't be found";
    err.errors = { message: "Review image couldn't be found" };
    err.status = 404;
    return next(err);
});

module.exports = router;
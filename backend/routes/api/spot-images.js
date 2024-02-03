const express = require("express");
const { requireAuth } = require("../../utils/auth");

const { Spot, SpotImage, User } = require("../../db/models");

const router = express.Router();

// Delete a spot image
router.delete("/:imageId", requireAuth, async (req, res, next) => {
    const image = await SpotImage.findByPk(req.params.imageId);

    if (image) {
        const spot = await Spot.findByPk(image.spotId);
        if (spot) {
            if (req.user.id === spot.ownerId) {
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
    }

    const err = new Error("Spot image couldn't be found");
    err.title = "Spot image couldn't be found";
    err.errors = { message: "Spot image couldn't be found" };
    err.status = 404;
    return next(err);
});

module.exports = router;
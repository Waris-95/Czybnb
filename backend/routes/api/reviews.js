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
    let Reviews = [];
    // Get reviews
    const reviews = await Review.findAll({
        where: { userId: req.user.id },
        include: [
            { model: User, attributes: ["id", "firstName", "lastName"] },
            {
                model: Spot,
                attributes: {
                    exclude: ["createdAt", "updatedAt", "description"],
                },
                include: [{ model: SpotImage }],
            },
            { model: ReviewImage, attributes: ["id", "url"] },
        ],
    });
    // Modifying data of each review to match output requirements
    reviews.forEach((review) => {
        review = review.toJSON();
        review.Spot.SpotImages.forEach((spotImage) => {
            if (spotImage.preview === true) {
                review.Spot.previewImage = spotImage.url;
            }
        });
        if (!review.Spot.previewImage) {
            review.Spot.previewImage = "No preview image found";
        }
        delete review.Spot.SpotImages;
        Reviews.push(review);
    });
    res.json({ Reviews });
});

// Add an image to a review based on review id
router.post("/:reviewId/images", requireAuth, async (req, res, next) => {
    const review = await Review.findByPk(req.params.reviewId);
    const reviewImages = await ReviewImage.findAll({
        where: { reviewId: req.params.reviewId },
    });

    if (reviewImages.length >= 10) {
        // console.log("reviewImages length:", reviewImages.length);
        const err = new Error(
            "Maximum number of images for this resource was reached"
        );
        err.title = "Maximum number of images for this resource was reached";
        err.errors = {
            message: "Maximum number of images for this resource was reached",
        };
        err.status = 403;
        return next(err);
    }

    if (review) {
        if (review.userId === req.user.id) {
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
router.put("/:reviewId", validateReview, async (req, res, next) => {
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

    const err = new Error("Review couldn't be found");
    err.title = "Review couldn't be found";
    err.errors = { message: "Review couldn't be found" };
    err.status = 404;
    return next(err);
});

// Delete a review
router.delete("/:reviewId", requireAuth, async (req, res, next) => {
    const review = await Review.findByPk(req.params.reviewId);

    if (review) {
        if (req.user.id === review.userId) {
            review.destroy();

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
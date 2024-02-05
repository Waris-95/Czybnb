const express = require("express");
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const {
    Review,
    Spot,
    SpotImage,
    User,
    Booking,
    Sequelize,
} = require("../../db/models");

const router = express.Router();

router.get("/current", requireAuth, async (req, res, next) => {
    let currBookings = [];

    const bookings = await Booking.findAll({
        where: { userId: req.user.id },
        include: [
            {
                model: Spot,
                attributes: {
                    exclude: ["createdAt", "updatedAt", "description"],
                },
                include: [{ model: SpotImage }],
            },
        ],
    });

    bookings.forEach((booking) => {
        booking = booking.toJSON();
        booking.Spot.SpotImages.forEach((spotImage) => {
            if (spotImage.preview === true) {
                booking.Spot.previewImage = spotImage.url;
            }
        });
        if (!booking.Spot.previewImage) {
            booking.Spot.previewImage = "No preview image found";
        }
        delete booking.Spot.SpotImages;
        currBookings.push(booking);
    });
    res.json({ Bookings: currBookings });
});

const validateBooking = [
    check("startDate")
        .exists({ checkFalsy: true })
        .withMessage("Must choose a start date"),
    check("endDate")
        .exists({ checkFalsy: true })
        .withMessage("Must choose an end date"),
    check("endDate")
        .custom((value, { req }) => {
            const endDate = new Date(value).getTime();
            const startDate = new Date(req.body.startDate).getTime();

            return endDate > startDate;
        })
        .withMessage("endDate cannot be on or before startDate"),
    handleValidationErrors,
    requireAuth,
];

// Edit a booking
router.put("/:bookingId", validateBooking, async (req, res, next) => {
    const booking = await Booking.findByPk(req.params.bookingId);

    if (booking) {
        if (booking.userId === req.user.id) {
            const { startDate, endDate } = req.body;
            const spot = await Spot.findByPk(booking.spotId);
            const bookings = await spot.getBookings();
            const startValue = new Date(startDate).getTime();
            const endValue = new Date(endDate).getTime();

            if (bookings.length > 0) {
                for (const currBooking of bookings) {
                    if (currBooking.id !== booking.id) {
                        const bookingStart = new Date(
                            currBooking.startDate
                        ).getTime();
                        const bookingEnd = new Date(
                            currBooking.endDate
                        ).getTime();

                        let bookingErr = [];

                        if (
                            startValue >= bookingStart &&
                            startValue <= bookingEnd
                        ) {
                            bookingErr.push("start");
                        }
                        if (
                            endValue >= bookingStart &&
                            endValue <= bookingEnd
                        ) {
                            bookingErr.push("end");
                        }

                        if (bookingErr.length > 0) {
                            const err = new Error(
                                "Sorry, this spot is already booked for the specified dates"
                            );
                            err.title = "Booking error";
                            err.errors = {};
                            if (bookingErr.includes("start")) {
                                err.errors.startDate =
                                    "Start date conflicts with an existing booking";
                            }
                            if (bookingErr.includes("end")) {
                                err.errors.endDate =
                                    "End date conflicts with an existing booking";
                            }
                            err.status = 403;
                            return next(err);
                        }
                    }
                }
            }

            const currTime = Date.now();
            if (currTime > endValue) {
                const err = new Error("Past bookings can't be modified");
                err.title = "Past bookings can't be modified";
                err.errors = { message: "Past bookings can't be modified" };
                err.status = 403;
                return next(err);
            }

            booking.startDate = startDate;
            booking.endDate = endDate;

            await booking.save();

            return res.json(booking);
        } else {
            const err = new Error("Forbidden");
            err.title = "Forbidden";
            err.errors = { message: "Not authorized to take this action" };
            err.status = 403;
            return next(err);
        }
    }

    const err = new Error("Booking couldn't be found");
    err.title = "Booking couldn't be found";
    err.errors = { message: "Booking couldn't be found" };
    err.status = 404;
    return next(err);
});

// Delete a booking
router.delete("/:bookingId", requireAuth, async (req, res, next) => {
    const booking = await Booking.findByPk(req.params.bookingId);

    if (booking) {
        const spot = await Spot.findByPk(booking.spotId);
        const currTime = Date.now();
        const startDate = new Date(booking.startDate).getTime();

        if (currTime > startDate) {
            const err = new Error(
                "Bookings that have been started can't be deleted"
            );
            err.title = "Bookings that have been started can't be deleted";
            err.errors = {
                message: "Bookings that have been started can't be deleted",
            };
            err.status = 403;
            return next(err);
        }

        if (booking.userId === req.user.id || spot.ownerId === req.user.id) {
            booking.destroy();
            return res.json({ message: "Succesfully deleted" });
        } else {
            const err = new Error("Forbidden");
            err.title = "Forbidden";
            err.errors = { message: "Not authorized to take this action" };
            err.status = 403;
            return next(err);
        }
    }

    const err = new Error("Booking couldn't be found");
    err.title = "Booking couldn't be found";
    err.errors = { message: "Booking couldn't be found" };
    err.status = 404;
    return next(err);
});

module.exports = router;
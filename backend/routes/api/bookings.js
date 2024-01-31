// Import necessary modules and models
const express = require("express");
const { requireAuth } = require("../../utils/auth");
const router = express.Router();
const { Op } = require("sequelize");
const {
  Spot,
  Review,
  SpotImage,
  User,
  Booking,
  sequelize,
  ReviewImage,
} = require("../../db/models");

// Define a route to get all of the current user's bookings
router.get("/current", requireAuth, async (req, res) => {
  try {
    // Extract the user information from the request object
    const { user } = req;

    // Fetch all bookings for the current user, including related spot and spot images
    const bookings = await Booking.findAll({
      where: {
        userId: user.id,
      },
      include: [
        {
          model: Spot,
          as: "Spot",
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
              as: "SpotImages",
              attributes: ["id", "url"],
              where: { preview: true },
              required: false,
            },
          ],
        },
      ],
    });

    // Prepare an array to store the formatted bookings
    const formattedBookings = [];

    // Iterate through each booking to format the data
    bookings.forEach((booking) => {
      // Extract relevant information from the booking and related spot
      const spot = booking.Spot;
      const previewImage =
        spot.SpotImages.length > 0 ? spot.SpotImages[0].url : null;

      // Build a formatted booking object and push it to the array
      formattedBookings.push({
        id: booking.id,
        spotId: booking.spotId,
        Spot: {
          id: spot.id,
          ownerId: spot.ownerId,
          address: spot.address,
          city: spot.city,
          state: spot.state,
          country: spot.country,
          lat: spot.lat,
          lng: spot.lng,
          name: spot.name,
          price: spot.price,
          previewImage: previewImage,
        },
        userId: booking.userId,
        startDate: booking.startDate,
        endDate: booking.endDate,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
      });
    });

    // Send the formatted bookings as a JSON response
    res.status(200).json({ Bookings: formattedBookings });
  } catch (error) {
    // Handle errors, log them, and send an internal server error response
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});


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

// delete a booking 





module.exports = router
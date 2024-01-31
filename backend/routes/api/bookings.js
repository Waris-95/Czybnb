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


// ediiting a booking 
router.put("/:bookingId", requireAuth, async (req, res) => {
    const { user } = req;
    const { startDate, endDate } = req.body;
    try {

    } catch (error) {
        
    }
})

module.exports = router
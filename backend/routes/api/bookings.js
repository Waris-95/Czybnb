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
router.put("/:bookingId", requireAuth, async (req, res) => {
    // Extract user and new dates from the request
    const { user } = req;
    const { startDate, endDate } = req.body;
  
    try {
      // Find the booking to be edited by its ID
      const booking = await Booking.findByPk(req.params.bookingId);
  
      // Check if the booking exists
      if (!booking) {
        return res.status(404).json({ message: "Booking couldn't be found" });
      }
  
      // Check if the user is the owner of the booking
      if (booking.userId !== user.id) {
        return res.status(403).json({
          message: "You must log in as the owner of this booking to edit",
        });
      }
  
      // Check if the booking is in the past and can't be modified
      if (booking.endDate < new Date()) {
        return res
          .status(403)
          .json({ message: "Past bookings can't be modified" });
      }
  
      // Remove the time portion of the dates
      const formattedStartDate = new Date(startDate).toISOString().split("T")[0];
      const formattedEndDate = new Date(endDate).toISOString().split("T")[0];
  
      // Check for conflicting bookings for the same spot and date range
      const conflictingBooking = await Booking.findOne({
        where: {
          spotId: booking.spotId,
          startDate: { [Op.lte]: formattedEndDate },
          endDate: { [Op.gte]: formattedStartDate },
          id: { [Op.not]: booking.id },
        },
      });
  
      // If conflicting booking is found, handle the error
      if (conflictingBooking) {
        return res.status(403).json({
          message: "Sorry, this spot is already booked for the specified dates",
          errors: {
            startDate: "Start date conflicts with an existing booking",
            endDate: "End date conflicts with an existing booking",
          },
        });
      }
  
      // Update the booking with the new formatted dates
      booking.startDate = formattedStartDate;
      booking.endDate = formattedEndDate;
  
      // Save the changes to the database
      await booking.save();
  
      // Return the updated booking as a JSON response
      return res.status(200).json(booking);
    } catch (error) {
      // Handle errors, log them, and send an internal server error response
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
});


// Delete a booking 
router.delete("/:bookingId", requireAuth, async (req, res) => {
    // Extract user information from the request
    const { user } = req;

    try {
        // Find the booking to be deleted, including associated spot details
        const booking = await Booking.findByPk(req.params.bookingId, {
            include: {
                model: Spot,
            },
        });

        // Check if the booking exists
        if (!booking) {
            return res.status(404).json({ message: "Booking couldn't be found" });
        }

        // Check if the booking has already started and can't be deleted
        if (booking.startDate <= new Date()) {
            return res.status(403).json({ message: "Bookings that have been started can't be deleted" });
        }

        // Check if the user is either the booking owner or the spot owner
        if (booking.userId !== user.id && booking.Spot.ownerId !== user.id) {
            return res.status(403).json({ message: "You are not authorized to delete this booking" });
        }

        // Delete the booking from the database
        await booking.destroy();

        // Return a success message as a JSON response
        return res.status(200).json({ message: "Successfully deleted" });
    } catch(error) {
        // Handle errors, log them, and send an internal server error response
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});



module.exports = router
const express = require('express');
const { requireAuth } = require('../../utils/auth');
const { Booking, Spot, SpotImage } = require('../../db/models');
const { Op } = require('sequelize');
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { validateBookingDates } = require('../../utils/validateSomeRoutes');
const moment = require('moment');

const router = express.Router();

// Get all bookings by currently logged in user
router.get('/current', requireAuth, async (req, res, next) => {
  try {
    const bookings = await Booking.findAll({
      where: { userId: req.user.id },
      include: [
        {
          model: Spot,
          attributes: [
            'id',
            'ownerId',
            'address',
            'city',
            'state',
            'country',
            'lat',
            'lng',
            'name',
            'price',
          ],
          include: [
            {
              model: SpotImage,
              as: 'SpotImages',
              attributes: ['url'],
              where: { preview: true },
              required: false, // query does not fail if no SpotImages are found
            },
          ],
        },
      ],
    });
      
    // Format the bookings to be returned to the client
    const formattedBookings = bookings.map((booking) => {
      const spotDetails = booking.Spot ? {
        id: booking.Spot.id,
        ownerId: booking.Spot.ownerId,
        address: booking.Spot.address,
        city: booking.Spot.city,
        state: booking.Spot.state,
        country: booking.Spot.country,
        lat: booking.Spot.lat,
        lng: booking.Spot.lng,
        name: booking.Spot.name,
        desc: booking.Spot.description, // changes added 
        price: booking.Spot.price,
        previewImage:
          booking.Spot.SpotImages && booking.Spot.SpotImages[0]
            ? booking.Spot.SpotImages[0].url
            : null,
      } : {};

      return {
        id: booking.id,
        spotId: booking.spotId,
        Spot: spotDetails,
        userId: booking.userId,
        startDate: moment(booking.startDate).format('YYYY-MM-DD HH:mm:ss'),
        endDate: moment(booking.endDate).format('YYYY-MM-DD HH:mm:ss'),
        createdAt: moment(booking.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        updatedAt: moment(booking.updatedAt).format('YYYY-MM-DD HH:mm:ss'),
      };
    });

    res.json({ Bookings: formattedBookings });
  } catch (error) {
    next(error);
  }
});


  
// Get all bookings by a specific spot
const validateBooking = [
  requireAuth,
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

                      // Simplified the condition for checking if there's an overlap
                      if (
                          (startValue >= bookingStart && startValue <= bookingEnd) ||
                          (endValue >= bookingStart && endValue <= bookingEnd) ||
                          (startValue <= bookingStart && endValue >= bookingEnd)
                      ) {
                          
                            return res.status(403).json({
                              message: 'Sorry, this spot is already booked for the specified dates',
                              errors: {
                                startDate: 'Start date conflicts with an existing booking',
                                endDate: 'End date conflicts with an existing booking',
                              },
                            });
                      }
                  }
              }
          }

          const currTime = Date.now();
          if (currTime > endValue) {
            return res
            .status(403)
            .json({ message: "Past bookings can't be modified" });
          }

          booking.startDate = startDate;
          booking.endDate = endDate;

          await booking.save();

          return res.json(booking);
       } else {
        return res.status(403).json({ message: 'Forbidden' });
    }
  }

  return res.status(404).json({ message: "Booking couldn't be found" });
});


// Delete a booking
router.delete('/:bookingId', requireAuth, async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user.id; // Retrieve the user ID from req.user

    const booking = await Booking.findByPk(bookingId, {
      include: {
        model: Spot,
        attributes: ['ownerId'],
      },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking couldn't be found" });
    }

    // Ensure that the authenticated user is either the booking owner or the spot owner
    if (booking.userId !== userId && booking.Spot.ownerId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Check if the booking has already started; if so, prevent deletion
    if (new Date(booking.startDate) <= new Date()) {
      return res.status(403).json({ message: "Bookings that have started can't be deleted" });
    }

    // Proceed with deletion if all checks pass
    await booking.destroy();
    res.json({ message: 'Successfully deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
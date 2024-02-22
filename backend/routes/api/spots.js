const express = require('express');
const { requireAuth } = require('../../utils/auth');

const {
  validateQueryParams,
  validateSpotCreation,
  validateSpotEdit,
  validateBooking,
  validateReview,
} = require('../../utils/validateSomeRoutes');

const {
  Spot,
  Review,
  SpotImage,
  User,
  ReviewImage,
  Booking,
} = require('../../db/models');
const { Op, fn, col, cast } = require('sequelize');
const Sequelize = require('sequelize');

const router = express.Router();

// GET all spots with query filters
router.get('/', validateQueryParams, async (req, res, next) => {
  try {
    let {
      page = 1,
      size = 20,
      minLat,
      maxLat,
      minLng,
      maxLng,
      minPrice,
      maxPrice,
    } = req.query;

    page = parseInt(page, 10);
    size = parseInt(size, 10);

    const whereClause = {
      ...(minLat && { lat: { [Sequelize.Op.gte]: parseFloat(minLat) } }),
      ...(maxLat && { lat: { [Sequelize.Op.lte]: parseFloat(maxLat) } }),
      ...(minLng && { lng: { [Sequelize.Op.gte]: parseFloat(minLng) } }),
      ...(maxLng && { lng: { [Sequelize.Op.lte]: parseFloat(maxLng) } }),
      ...(minPrice && { price: { [Sequelize.Op.gte]: parseFloat(minPrice) } }),
      ...(maxPrice && { price: { [Sequelize.Op.lte]: parseFloat(maxPrice) } }),
    };

    // Perform the query
    const spotsData = await Spot.findAndCountAll({
      where: whereClause,
      attributes: {
        include: [
          [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating'],
        ],
      },
      include: [
        {
          model: Review,
          attributes: [],
        },
        {
          model: SpotImage,
          as: 'SpotImages',
          attributes: ['url'],
          where: { preview: true },
          required: false,
        },
      ],
      group: ['Spot.id', 'SpotImages.id'],
      limit: size,
      offset: (page - 1) * size,
      subQuery: false,
      distinct: true,
    });

    const spots = spotsData.rows.map((spot) => {
      const spotJSON = spot.toJSON();
      const previewImage = spotJSON.SpotImages.length
        ? spotJSON.SpotImages[0].url
        : null;
      delete spotJSON.SpotImages;
      return {
        ...spotJSON,
        avgRating: spotJSON.avgRating || null,
        previewImage,
      };
    });

    res.status(200).json({
      Spots: spots,
      page,
      size,
    });
  } catch (error) {
    next(error);
  }
});

// Get spots by current user
router.get('/current', requireAuth, async (req, res, next) => {
  try {
    const curUserId = req.user.id;
    const spotsCurUser = await Spot.findAll({
      where: { ownerId: curUserId },
      attributes: {
        include: [
          [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating'],
        ],
      },
      include: [
        {
          model: Review,
          attributes: [],
          required: false,
        },
        {
          model: SpotImage,
          as: 'SpotImages',
          attributes: ['url'],
          where: {
            preview: true,
          },
          required: false,
          limit: 1,
        },
      ],
      group: ['Spot.id'],
      subQuery: false,
    });

    const spots = spotsCurUser.map((spot) => {
      const spotJson = spot.toJSON(); // Convert to a plain JSON object
      const previewImage =
        spotJson.SpotImages && spotJson.SpotImages.length > 0
          ? spotJson.SpotImages[0].url
          : null;
      delete spotJson.SpotImages;
      return {
        ...spotJson,
        avgRating: spotJson.avgRating ? parseFloat(spotJson.avgRating) : null,
        previewImage,
      };
    });

    res.status(200).json({ Spots: spots });
  } catch (error) {
    next(error);
  }
});

// Spot by id
router.get('/:spotId', async (req, res, next) => {
  try {
    const spotId = req.params.spotId;

    const spot = await Spot.findByPk(spotId, {
      include: [
        {
          model: Review,
          attributes: [],
        },
        {
          model: SpotImage,
          as: 'SpotImages',
          attributes: ['id', 'url', 'preview'],
        },
        {
          model: User,
          as: 'Owner',
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
      attributes: {
        include: [
          [fn('COUNT', col('Reviews.id')), 'numReviews'],
          [fn('AVG', col('Reviews.stars')), 'avgStarRating'],
        ],
      },
      group: ['Spot.id', 'SpotImages.id', 'Owner.id'],
    });

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    const spotJson = spot.toJSON();
    spotJson.avgStarRating = spotJson.avgStarRating
      ? parseFloat(spotJson.avgStarRating)
      : null;
    spotJson.numReviews = spotJson.numReviews || 0;

    res.status(200).json(spotJson);
  } catch (error) {
    next(error);
  }
});

// create spot
router.post('/', requireAuth, validateSpotCreation, async (req, res, next) => {
  try {
    // Extract spot details from the request body
    const {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    } = req.body;
    const ownerId = req.user.id;

    // Validate the required fields
    const errors = {};
    if (!address) errors.address = "Address is required";
    if (!city) errors.city = "City is required";
    if (!state) errors.state = "State is required";
    if (!country) errors.country = "Country is required";
    if (!lat || typeof lat !== "number")
      errors.lat = "Latitude is required and must be a number";
    if (!lng || typeof lng !== "number")
      errors.lng = "Longitude is required and must be a number";
    if (!name) errors.name = "Name must be less than 50 characters";
    if (!description) errors.description = "Description is required";
    if (!price) errors.price = "Price is required";

    // Check if there are any validation errors
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Bad Request", errors });
    }

    // Create the new spot
    const newSpot = await Spot.create({
      ownerId,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    });

    return res.status(201).json(newSpot);
  } catch (error) {
    // If an error occurs during spot creation, pass the error to the next middleware
    next(error);
  }
});

// Add image to spot
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
  const { spotId } = req.params;
  const { url, preview } = req.body;
  const userId = req.user.id;

  try {
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    if (spot.ownerId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const newImage = await SpotImage.create({
      spotId,
      url,
      preview,
    });
    const resBoby = {
      id: newImage.id,
      url: newImage.url,
      preview: newImage.preview,
    };

    res.status(200).json(resBoby);
  } catch (error) {
    next(error);
  }
});

// // Edit a Spot
// router.put("/:spotId", requireAuth, async (req, res) => {
//   try {
//     const spotId = req.params.spotId;
//     const userId = req.user.id;
//     const {
//       address,
//       city,
//       state,
//       country,
//       lat,
//       lng,
//       name,
//       description,
//       price,
//     } = req.body;

//     // Check if the spot exists and belongs to the current user
//     const spot = await Spot.findOne({
//       where: {
//         id: spotId,
//         ownerId: userId,
//       },
//     });

//     // If the spot is not found, return a 404 Not Found response
//     if (!spot) {
//       return res.status(404).json({ message: "Spot couldn't be found" });
//     }

//     // Update the spot
//     spot.address = address;
//     spot.city = city;
//     spot.state = state;
//     spot.country = country;
//     spot.lat = lat;
//     spot.lng = lng;
//     spot.name = name;
//     spot.description = description;
//     spot.price = price;

//     await spot.save();

//     res.status(200).json(spot);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

router.put(
  '/:spotId',
  requireAuth,
  validateSpotEdit,
  async (req, res, next) => {
    try {
      const spotId = req.params.spotId;
      const spot = await Spot.findByPk(spotId);

      if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
      }

      if (spot.ownerId !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      const {
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
      } = req.body;
      await spot.update({
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
      });
      res.status(200).json(spot);
    } catch (error) {
      next(error);
    }
  }
);


// // Delete a spot *
// router.delete("/:spotId", requireAuth, async (req, res, next) => {
//   try {
//     // Extract user ID and spot ID from the request
//     const userId = req.user.id;
//     const spotId = req.params.spotId;
//     const spot = await Spot.findByPk(spotId);

//     if (!spot) {
//       return res.status(404).json({ message: "Spot couldn't be found" });
//     }

//     if (spot.ownerId !== req.user.id) {
//       return res.status(403).json({ message: 'Forbidden' });
//     }

//     const bookings = await Booking.findAll({
//       where: { spotId },
//       include: [
//         {
//           model: User,
//           attributes: ['id', 'firstName', 'lastName'],
//         },
//       ],
//     });

//     const resBookings = bookings.map((booking) => {
//       return {
//         User: booking.User,
//         id: booking.id,
//         spotId: booking.spotId,
//         userId: booking.userId,
//         startDate: booking.startDate,
//         endDate: booking.endDate,
//         createdAt: booking.createdAt,
//         updatedAt: booking.updatedAt,
//       };
//     });

//     if (req.user.id === spot.ownerId) {
//       res.json({ Bookings: resBookings });
//     } else {
//       const bookingsWithoutUser = resBookings.map(
//         ({ spotId, startDate, endDate }) => ({
//           spotId,
//           startDate,
//           endDate,
//         })
//       );
//       res.json({ Bookings: bookingsWithoutUser });
//     }
//   } catch (error) {
//     next(error);
//   }
// });


router.delete('/:spotId', requireAuth, async (req, res, next) => {
  try {
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    if (spot.ownerId !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
    await spot.destroy();
    res.status(200).json({ message: 'Successfully deleted' });
  } catch (error) {
    next(error);
  }
});

// Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res, next) => {
  const { spotId } = req.params;
  try {
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }
    const reviews = await Review.findAll({
      where: { spotId: spotId },
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['id', 'firstName', 'lastName'],
        },
        { model: ReviewImage, attributes: ['id', 'url'] },
      ],
    });
    res.status(200).json({ Reviews: reviews });
  } catch (error) {
    next(error);
  }
});

// Create a Review for a Spot based on the Spot's id
router.post(
  '/:spotId/reviews',
  requireAuth,
  validateReview,
  async (req, res, next) => {
    try {
      const spotId = parseInt(req.params.spotId, 10);
      const { review, stars } = req.body;

      const spot = await Spot.findByPk(spotId);
      if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
      }

      const existingReview = await Review.findOne({
        where: { spotId, userId: req.user.id },
      });
      if (existingReview) {
        return res
          .status(500)
          .json({ message: 'User already has a review for this spot' });
      }

      const newReview = await Review.create({
        userId: req.user.id,
        spotId,
        review,
        stars,
      });
      res.status(201).json(newReview);
    } catch (error) {
      next(error);
    }
  }
);

// Get all Bookings for a Spot based on the Spot's id

router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
  try {
    const spotId = req.params.spotId;
    const spot = await Spot.findByPk(spotId);
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }
    const bookings = await Booking.findAll({
      where: { spotId },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
    });
    const resBookings = bookings.map((booking) => {
      return {
        User: booking.User,
        id: booking.id,
        spotId: booking.spotId,
        userId: booking.userId,
        startDate: booking.startDate,
        endDate: booking.endDate,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
      };
    });
    if (req.user.id === spot.ownerId) {
      res.json({ Bookings: resBookings });
    } else {
      const bookingsWithoutUser = resBookings.map(
        ({ spotId, startDate, endDate }) => ({
          spotId,
          startDate,
          endDate,
        })
      );
      res.json({ Bookings: bookingsWithoutUser });
    }
  } catch (error) {
    next(error);
  }
});

// Create a booking for a spot based on id
router.post("/:spotId/bookings", requireAuth, validateBooking, async (req, res, next) => {
  try {
    const spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
      return res.status(404).json({
        message: "Spot couldn't be found",
      });
    }

    const { startDate, endDate } = req.body;
    const bookings = await spot.getBookings();

    if (bookings.length > 0) {
      // Check for booking conflicts
      let bookingErr = [];

      console.log("Start Date:", startDate);
      console.log("End Date:", endDate);



      for (const currBooking of bookings) {
        const startValue = new Date(startDate).getTime();
        const endValue = new Date(endDate).getTime();
        const bookingStart = new Date(currBooking.startDate).getTime();
        const bookingEnd = new Date(currBooking.endDate).getTime();

        console.log("Booking Start Date:", currBooking.startDate);
        console.log("Booking End Date:", currBooking.endDate);

        // Check for overlap
        if (
          (startValue >= bookingStart && startValue <= bookingEnd) || // Inside existing booking
          (endValue >= bookingStart && endValue <= bookingEnd) || // Inside existing booking
          (startValue <= bookingStart && endValue >= bookingEnd) || // Outside existing booking
          (endValue >= bookingStart && endValue <= bookingEnd) // End date falls within existing booking
        ) {
          bookingErr.push("overlap");
        }
      }

      if (bookingErr.length > 0) {
        const err = new Error
          ("Sorry, this spot is already booked for the specified dates");
        err.title = "Booking error";
        err.errors = {
          startDate: "Start date conflicts with an existing booking",
          endDate: "End date conflicts with an existing booking",
        };

        // Set error message for overlap
        // err.errors.message = "Spot is already booked for the specified dates";

        err.status = 403;
        throw err;
      }
    }

    // Create new booking
    if (spot.ownerId !== req.user.id) {
      const newBooking = await Booking.create({
        userId: req.user.id,
        spotId: parseInt(req.params.spotId),
        startDate,
        endDate,
      });

      return res.json(newBooking);
    } else {
      return res.status(403).json({ message: 'Forbidden' });
    }
  } catch (error) {
    next(error);
  }
});



module.exports = router;
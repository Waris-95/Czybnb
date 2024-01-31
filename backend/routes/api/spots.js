const express = require("express");
const bcrypt = require("bcryptjs");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const {
  User,
  Spot,
  SpotImage,
  Booking,
  Review,
  ReviewImage,
  sequelize,
} = require("../../db/models");
const { Op } = require('sequelize');
const router = express.Router();
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");


// Helper function to handle not found cases
const handleNotFound = (res, message) => {
  return res.status(404).json({ message });
};

// Get all reviews based on spot's id
router.get("/:spotId/reviews", async (req, res, next) => {
  try {
    // Find the spot by its primary key
    const spot = await Spot.findByPk(req.params.spotId);

    // Check if the spot exists; if not, handle not found
    if (!spot) {
      return handleNotFound(res, "Spot couldn't be found");
    }

    // Find all reviews associated with the given spotId
    const reviews = await Review.findAll({
      where: {
        spotId: req.params.spotId,
      },
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName"],
        },
        {
          model: ReviewImage,
          attributes: ["id", "url"],
        },
      ],
    });

    // Return the reviews as JSON
    return res.json({ Reviews: reviews });
  } catch (error) {
    // Pass any errors to the error-handling middleware
    next(error);
  }
});

// Get all Bookings for a Spot based on the Spot's id
router.get("/:spotId/bookings", requireAuth, async (req, res, next) => {
  const { user } = req; // Extract user from request

  try {
    // Find the spot by its primary key
    const spot = await Spot.findByPk(req.params.spotId);

    // Check if the spot exists; if not, handle not found
    if (!spot) {
      return handleNotFound(res, "Spot couldn't be found");
    }

    // Check if the authenticated user is not the owner of the spot
    if (spot.ownerId !== user.id) {
      // Fetch bookings without user details for non-owners
      const notOwnerBookings = await Booking.findAll({
        where: {
          spotId: req.params.spotId,
        },
        attributes: ["spotId", "startDate", "endDate"],
      });

      // Return non-owner bookings
      return res.status(200).json({ Bookings: notOwnerBookings });
    } else {
      // Fetch bookings with user details for owners
      const ownerBookings = await Booking.findAll({
        where: {
          spotId: req.params.spotId,
        },
        include: {
          model: User,
          attributes: ["id", "firstName", "lastName"],
        },
      });

      // Return owner bookings
      return res.status(200).json({ Bookings: ownerBookings });
    }
  } catch (error) {
    // Pass any errors to the error-handling middleware
    next(error);
  }
});


// Validation middleware for getAllSpots route
const validateGetAllSpots = [
  // Validate the 'page' parameter
  check("page")
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage("Page must be an integer between 1 and 10."),

  // Validate the 'size' parameter
  check("size")
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage("Size must be an integer between 1 and 20."),

  // Validate the 'minLat' parameter
  check("minLat")
    .optional()
    .isDecimal()
    .withMessage("Minimum latitude is invalid."),

  // Validate the 'maxLat' parameter
  check("maxLat")
    .optional()
    .isDecimal()
    .withMessage("Maximum latitude is invalid."),

  // Validate the 'minLng' parameter
  check("minLng")
    .optional()
    .isDecimal()
    .withMessage("Minimum longitude is invalid."),

  // Validate the 'maxLng' parameter
  check("maxLng")
    .optional()
    .isDecimal()
    .withMessage("Maximum longitude is invalid."),

  // Validate the 'minPrice' parameter
  check("minPrice")
    .optional()
    .isDecimal({ min: 0 })
    .withMessage("Minimum price must be a decimal greater than or equal to 0."),

  // Validate the 'maxPrice' parameter
  check("maxPrice")
    .optional()
    .isDecimal({ min: 0 })
    .withMessage("Maximum price must be a decimal greater than or equal to 0."),

  // Custom validation error handler
  handleValidationErrors,
];

// Get all spots
router.get('/', validateGetAllSpots, async (req, res, next) => {
  try {
    const errors = {};
    let { page, size, maxLat, minLat, minLng, maxLng, minPrice, maxPrice } = req.query;

    // Helper function to convert strings to integers or default to a value
    const parseIntOrDefault = (value, defaultValue) => parseInt(value) || defaultValue;

    page = parseIntOrDefault(page, 1);
    size = parseIntOrDefault(size, 20);

    // Validate 'page' and 'size' parameters
    if (isNaN(page) || page < 1 || page > 10) {
      errors.page = 'Page must be between 1 and 10';
    }

    if (isNaN(size) || size < 1 || size > 20) {
      errors.size = 'Size must be between 1 and 20';
    }

    // Validate latitude, longitude, and price parameters
    const validateNumberParameter = (param, errorKey, minValue = 0) => {
      if (req.query[param] !== undefined && isNaN(req.query[param])) {
        errors[errorKey] = `${param} is invalid`;
      }

      if (req.query[param] !== undefined && (isNaN(req.query[param]) || req.query[param] < minValue)) {
        errors[errorKey] = `${param} must be greater than or equal to ${minValue}`;
      }
    };

    validateNumberParameter('maxLat', 'maxLat');
    validateNumberParameter('minLat', 'minLat');
    validateNumberParameter('minLng', 'minLng');
    validateNumberParameter('maxLng', 'maxLng');
    validateNumberParameter('minPrice', 'minPrice');
    validateNumberParameter('maxPrice', 'maxPrice');

    // Return validation errors if any
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        message: 'Bad Request',
        errors: errors
      });
    }

    const where = {};

    // Construct the 'where' object based on query parameters
    const constructWhere = (param, op) => {
      if (req.query[param] !== undefined) {
        where[param] = {
          [op]: parseFloat(req.query[param])
        };
      }
    };

    constructWhere('maxLat', Op.lte);
    constructWhere('minLat', Op.gte);
    constructWhere('minLng', Op.gte);
    constructWhere('maxLng', Op.lte);
    constructWhere('minPrice', Op.gte);
    constructWhere('maxPrice', Op.lte);

    const pagination = {
      limit: size,
      offset: size * (page - 1)
    };

    const allSpots = await Spot.findAll({
      include: [
        { model: Review },
        { model: SpotImage }
      ],
      where: where,
      ...pagination
    });

    const spots = allSpots.map(spot => {
      // Map spots to desired format
      const reviewCount = spot.Reviews.length;
      const totalStars = spot.Reviews.reduce((sum, review) => sum + review.stars, 0);
      const avgRating = reviewCount > 0 ? totalStars / reviewCount : 0;
      const previewImage = spot.SpotImages.find(image => image.preview === true);

      return {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: parseFloat(spot.lat),
        lng: parseFloat(spot.lng),
        name: spot.name,
        description: spot.description,
        price: parseFloat(spot.price),
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        avgRating: avgRating,
        previewImage: previewImage ? previewImage.url : 'No preview image found'
      };
    });

    return res.status(200).json({
      Spots: spots,
      page: page,
      size: size
    });
  } catch (error) {
    next(error);
  }
});


// Get all spots owned by the current user
router.get("/current", requireAuth, async (req, res) => {
  try {
    // Get the user ID from the authenticated user's request
    const userId = req.user.id;

    // Retrieve spots owned by the current user with additional details
    const spots = await Spot.findAll({
      where: {
        ownerId: userId,
      },
      include: [
        // Include spot images with a filter for the preview image
        {
          model: SpotImage,
          as: "SpotImages",
          where: { preview: true },
          required: false,
        },
        // Include reviews with an average rating calculation
        {
          model: Review,
          as: "Reviews",
          attributes: [
            [sequelize.fn("AVG", sequelize.col("Reviews.stars")), "avgRating"],
          ],
          required: false,
        },
      ],
      // Group by spot, spot images, and reviews to avoid duplicate results
      group: ["Spot.id", "SpotImages.id", "Reviews.id"],
    });

    // Format the spots with relevant details for response
    const formattedSpots = spots.map((spot) => {
      let avgRating = 0;

      // Extract the average rating from the Reviews association
      if (spot.Reviews && spot.Reviews.length > 0) {
        avgRating = parseFloat(spot.Reviews[0].getDataValue("avgRating")).toFixed(1);
      }

      // Extract the preview image URL from the SpotImages association
      const previewImage = spot.SpotImages && spot.SpotImages.length > 0
        ? spot.SpotImages[0].url
        : null;

      // Create a formatted spot object
      return {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
        avgRating: avgRating,
        previewImage: previewImage,
      };
    });

    // Send the formatted spots as a JSON response
    res.status(200).json({ Spots: formattedSpots });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET details of a spot from an id
router.get("/:spotId", async (req, res) => {
  try {
    // Extract spotId from the request parameters
    const spotId = req.params.spotId;

    // Retrieve spot details with associated SpotImages and Owner
    const spot = await Spot.findByPk(spotId, {
      include: [
        {
          model: SpotImage,
          attributes: ["id", "url", "preview"],
        },
        {
          model: User,
          as: "Owner",
          attributes: ["id", "firstName", "lastName"],
        },
      ],
    });

    // If spot not found, return a 404 error
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // Retrieve reviews associated with the spot
    const reviews = await Review.findAll({
      where: { spotId: spot.id },
    });

    // Calculate the number of reviews, total stars, and average star rating
    const numReviews = reviews.length;
    const totalStars = reviews.reduce((sum, review) => sum + review.stars, 0);
    const avgStarRating = numReviews > 0 ? totalStars / numReviews : 0;

    // Prepare the response object with spot details
    const response = {
      id: spot.id,
      ownerId: spot.ownerId,
      address: spot.address,
      city: spot.city,
      state: spot.state,
      country: spot.country,
      lat: spot.lat,
      lng: spot.lng,
      name: spot.name,
      description: spot.description,
      price: spot.price,
      createdAt: spot.createdAt,
      updatedAt: spot.updatedAt,
      numReviews,
      avgStarRating,
      SpotImages: spot.SpotImages,
      Owner: spot.Owner,
    };

    // Send the response as JSON
    res.json(response);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error fetching spot details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Create a Booking from a Spot based on the Spot's id
router.post("/:spotId/bookings", requireAuth, async (req, res) => {
  try {
    // Extract necessary data from the request
    const { user } = req;
    const { startDate, endDate } = req.body;

    // Find the spot using the provided spotId
    const spot = await Spot.findByPk(req.params.spotId);

    // Check if the spot exists or if the user is the owner of the spot
    if (!spot || spot.ownerId === user.id) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // Parse the start and end dates from the request body
    const startDay = new Date(startDate);
    const lastDay = new Date(endDate);

    // Check if the end date comes before the start date
    if (startDay >= lastDay) {
      return res.status(400).json({
        message: "Bad Request",
        errors: {
          endDate: "endDate cannot come before startDate",
        },
      });
    }

    // Retrieve all existing bookings for the spot
    const allBookings = await Booking.findAll({
      where: {
        spotId: spot.id,
      },
    });

    // Check for date conflicts with existing bookings
    const comment = { message: "Sorry, this spot is already booked for the specified dates", errors: {} };

    allBookings.forEach((existingBooking) => {
      if (existingBooking.startDate <= startDay && existingBooking.endDate >= startDay) {
        comment.errors.startDate = "Start date conflicts with an existing booking";
      }
      if (existingBooking.endDate >= lastDay && existingBooking.startDate <= lastDay) {
        comment.errors.endDate = "End date conflicts with an existing booking";
      }
    });

    // If date conflicts are found, return a 403 Forbidden response
    if (Object.keys(comment.errors).length) {
      return res.status(403).json({ message: comment.message, errors: comment.errors });
    } else {
      // Create a new booking
      const booking = await Booking.create({
        spotId: spot.id,
        userId: user.id,
        startDate: startDay,
        endDate: lastDay,
      });

      // Prepare and send the response with scheduled dates
      const scheduleDates = {
        id: booking.id,
        spotId: spot.id,
        userId: user.id,
        startDate: startDate,
        endDate: endDate,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
      };

      return res.status(200).json(scheduleDates);
    }
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Add an image to a spot based on spot id
router.post("/:spotId/images", requireAuth, async (req, res) => {
  try {
    const spotId = req.params.spotId;
    const userId = req.user.id;
    const { url, preview } = req.body;

    // Check if the spot exists and belongs to the current user
    const spot = await Spot.findOne({
      where: {
        id: spotId,
        ownerId: userId,
      },
    });

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // Create the image
    const image = await SpotImage.create(
      {
        spotId,
        url,
        preview,
      },
      {
        // Exclude createdAt, updatedAt, and spotId fields
        attributes: { exclude: ["createdAt", "updatedAt", "spotId"] },
      }
    );

    // Remove the updatedAt, createdAt, and spotId fields from the image object
    const {
      updatedAt,
      createdAt,
      spotId: imageSpotId,
      ...imageWithoutTimestamps
    } = image.toJSON();

    res.status(200).json(imageWithoutTimestamps);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// addd a review spot id
router.post("/:spotId/reviews", requireAuth, async (req, res) => {
  const { review, stars } = req.body;
  const { user } = req;

  try {
    const spot = await Spot.findByPk(req.params.spotId);
    const comment = { message: "Bad Request", errors: {} };

    if (!review) {
      comment.errors.review = "Review text is required";
    }
    if (!stars || parseInt(stars) < 1 || parseInt(stars) > 5) {
      comment.errors.stars = "Stars must be an integer from 1 to 5";
    }

    if (Object.keys(comment.errors).length) {
      return res
        .status(400)
        .json({ message: comment.message, errors: comment.errors });
    }

    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    const existingReview = await Review.findOne({
      where: {
        userId: user.id,
        spotId: req.params.spotId,
      },
    });

    if (existingReview) {
      return res
        .status(409)
        .json({ message: "User already has a review for this spot" });
    }

    const createdReview = await Review.create({
      userId: user.id,
      spotId: spot.id,
      review: review,
      stars: stars,
    });

    return res.status(201).json(createdReview);
  } catch (error) {
    next(error);
  }
});

//Create a Spot Post
router.post("/", requireAuth, async (req, res, next) => {
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

    // Create the new spot in the database
    const newSpot = await Spot.create({
      ownerId: req.user.id,
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

    // Return a 201 Created response with the newly created spot
    return res.status(201).json(newSpot);
  } catch (error) {
    // If an error occurs during spot creation, pass the error to the next middleware
    next(error);
  }
});

// Edit a Spot
router.put("/:spotId", requireAuth, async (req, res) => {
  try {
    // Extract spotId from the request parameters and userId from the authenticated user
    const spotId = req.params.spotId;
    const userId = req.user.id;

    // Extract fields to update from the request body
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

    // Check if the spot exists and belongs to the current user
    const spot = await Spot.findOne({
      where: {
        id: spotId,
        ownerId: userId,
      },
    });

    // If the spot is not found, return a 404 Not Found response
    if (!spot) {
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // Update the spot with the new information
    spot.address = address;
    spot.city = city;
    spot.state = state;
    spot.country = country;
    spot.lat = lat;
    spot.lng = lng;
    spot.name = name;
    spot.description = description;
    spot.price = price;

    // Save the changes to the spot in the database
    await spot.save();

    // Return a 200 OK response with the updated spot information
    res.status(200).json(spot);
  } catch (error) {
    // If an error occurs during the update process, log the error and return a 500 Internal Server Error response
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Delete a spot *
router.delete("/:spotId", requireAuth, async (req, res) => {
  try {
    // Extract user ID and spot ID from the request
    const userId = req.user.id;
    const spotId = req.params.spotId;

    // Find the spot to be deleted using a specific query
    const spot = await Spot.findOne({
      where: {
        id: spotId,
        ownerId: userId,
      },
    });

    // Check if the spot exists and is owned by the user
    if (!spot) {
      // If not found or not owned, return a 404 Not Found status
      return res.status(404).json({ message: "Spot couldn't be found" });
    }

    // Delete the spot from the database
    await spot.destroy();

    // Respond with a 200 OK status and a success message
    res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error deleting spot:", error);

    // Respond with a 500 Internal Server Error status and an error message
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;
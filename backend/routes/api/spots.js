const express = require("express");
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage, Review, sequelize } = require('../../db/models');
const router = express.Router();
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

// Route to get all spots with average ratings and preview images
router.get('/', async (req, res) => {
  try {
    // Fetch all spots with associated SpotImages and Reviews
    const spots = await Spot.findAll({
      include: [
        {
          model: SpotImage,
          as: 'SpotImages',
          where: { preview: true },
          required: false,
        },
        {
          model: Review,
          as: 'Reviews',
          attributes: [[sequelize.fn('AVG', sequelize.col('stars')), 'avgRating']],
          required: false,
        },
      ],
      group: ['Spot.id', 'SpotImages.id'],
    });

    // Format the spots data for response
    const formattedSpots = spots.map((spot) => {
      let avgRating = 0;

      // Calculate average rating if reviews are available
      if (spot.Reviews.length > 0) {
        avgRating = parseFloat(spot.Reviews[0].getDataValue('avgRating')).toFixed(1);
      }

      let previewImage = null;

      // Set preview image URL or default message
      if (spot.SpotImages.length > 0) {
        previewImage = spot.SpotImages[0].url;
      } else {
        previewImage = 'No preview image found';
      }

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

    // Respond with formatted spots data
    res.status(200).json({ Spots: formattedSpots });
  } catch (error) {
    // Handle errors and respond with internal server error
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to get spots owned by the current user
router.get('/current', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch spots owned by the current user with associated SpotImages and Reviews
    const spots = await Spot.findAll({
      where: {
        ownerId: userId,
      },
      include: [
        {
          model: SpotImage,
          as: 'SpotImages',
          where: { preview: true },
          required: false,
        },
        {
          model: Review,
          as: 'Reviews',
          attributes: [[sequelize.fn('AVG', sequelize.col('stars')), 'avgRating']],
          required: false,
        },
      ],
      group: ['Spot.id', 'SpotImages.id'],
    });

    // Format the spots data for response
    const formattedSpots = spots.map((spot) => {
      let avgRating = 0;

      // Calculate average rating if reviews are available
      if (spot.Reviews && spot.Reviews.length > 0) {
        avgRating = parseFloat(spot.Reviews[0].getDataValue('avgRating')).toFixed(1);
      }

      // Set preview image URL or null
      const previewImage = spot.SpotImages && spot.SpotImages.length > 0 ? spot.SpotImages[0].url : null;

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

    // Respond with formatted spots data
    res.status(200).json({ Spots: formattedSpots });
  } catch (error) {
    // Handle errors and respond with internal server error
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to get details of a spot by its ID
router.get('/:spotId', async (req, res) => {
  try {
    const spotId = req.params.spotId;

    // Find the spot by ID with associated SpotImages, User (Owner), and Reviews
    const spot = await Spot.findByPk(spotId, {
      include: [
        {
          model: SpotImage,
          attributes: ['id', 'url', 'preview'],
        },
        {
          model: User,
          as: 'Owner',
          attributes: ['id', 'firstName', 'lastName'],
        },
      ],
    });

    // Return 404 if the spot is not found
    if (!spot) {
      return res.status(404).json({ message: 'Spot couldn\'t be found' });
    }

    // Fetch all reviews for the spot
    const reviews = await Review.findAll({
      where: { spotId: spot.id },
    });

    // Calculate the number of reviews and average star rating
    const numReviews = reviews.length;
    const totalStars = reviews.reduce((sum, review) => sum + review.stars, 0);
    const avgStarRating = numReviews > 0 ? totalStars / numReviews : 0;

    // Prepare the response payload
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

    // Respond with spot details
    res.json(response);
  } catch (error) {
    // Handle errors and respond with internal server error
    console.error('Error fetching spot details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add an image to a spot based on spot id
router.post('/:spotId/images', requireAuth, async (req, res) => {
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
      const image = await SpotImage.create({
        spotId,
        url,
        preview,
      }, {
        // Exclude createdAt, updatedAt, and spotId fields
        attributes: { exclude: ['createdAt', 'updatedAt', 'spotId'] },
      });
  
      // Remove the updatedAt, createdAt, and spotId fields from the image object
      const { updatedAt, createdAt, spotId: imageSpotId, ...imageWithoutTimestamps } = image.toJSON();
  
      res.status(200).json(imageWithoutTimestamps);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


// Route to create a new spot
router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { address, city, state, country, lat, lng, name, description, price } = req.body;

    // Validate the required fields
    const errors = {};
    if (!address) errors.address = 'Address is required';
    if (!city) errors.city = 'City is required';
    if (!state) errors.state = 'State is required';
    if (!country) errors.country = 'Country is required';
    if (!lat || typeof lat !== 'number') errors.lat = 'Latitude is required and must be a number';
    if (!lng || typeof lng !== 'number') errors.lng = 'Longitude is required and must be a number';
    if (!name) errors.name = 'Name must be less than 50 characters';
    if (!description) errors.description = 'Description is required';
    if (!price) errors.price = 'Price is required';

    // Check if there are any validation errors
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: 'Bad Request', errors });
    }

    // Create the new spot with the authenticated user as the owner
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

    // Respond with the created spot
    return res.status(201).json(newSpot);
  } catch (error) {
    // Pass errors to the next middleware
    next(error);
  }
});

// Edit a Spot
router.put("/:spotId", requireAuth, async (req, res) => {
    try {
      const spotId = req.params.spotId;
      const userId = req.user.id;
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
  
      if (!spot) {
        return res.status(404).json({ message: "Spot couldn't be found" });
      }
  
      // Update the spot
      spot.address = address;
      spot.city = city;
      spot.state = state;
      spot.country = country;
      spot.lat = lat;
      spot.lng = lng;
      spot.name = name;
      spot.description = description;
      spot.price = price;
  
      await spot.save();
  
      res.status(200).json(spot);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

// delete a spot
router.delete('/:spotId', requireAuth, async  (req, res, next) => {
    try {
        console.log('Deleting spot with ID:', req.params.spotId);

        const spot = await Spot.findByPk(req.params.spotId);

        if (spot) {
            if (req.user.id === spot.ownerId) {
                await spot.destroy();
                console.log('Spot successfully deleted');
                return res.json({ message: "Successfully deleted" });
            } else {
                console.log('Not authorized to delete this spot');
                const err = new Error("Forbidden");
                err.title = "Forbidden";
                err.errors = { message: "Not authorized to take this action" };
                err.status = 403;
                return next(err);
            }
        } else {
            console.log('Spot not found');
            const err = new Error("Spot couldn't be found");
            err.title = "Spot couldn't be found";
            err.errors = { message: "Spot couldn't be found" };
            err.status = 404;
            return next(err);
        }
    } catch (error) {
        console.error('Error deleting spot:', error);
        const err  = new Error("Internal Server Error");
        err.title = "Internal Server Error";
        err.errors = { message: "Internal Server Error" };
        err.status = 500;
        return next(err);
    }
})


// Export the router for use in the application
module.exports = router;

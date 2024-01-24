const express = require("express");
const{ Op } = require("sequelize");
const { requireAuth } = require("../../utils/auth");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { Spot, SpotImage, User, Review, ReviewImage, Booking } = require("../../db/models");
const { parseMIMEType } = require("undici-types");
const parseurl = require("parseurl");
const router = express.Router();

// VALIDATIONS (COME BACK TO IT LATER)
const validateQueries = [
    // Validate the 'page' parameter
    check("page")
        .custom((value) => {
            if (value) {
                return parseInt(value) >= 1;
            } else {
                return true;
            }
        })
        .withMessage("Ensure the 'page' value is greater than or equal to 1"),

    // Check the 'size' parameter
    check("size")
        .custom((value) => {
            if (value) {
                return parseInt(value) >= 1;
            } else {
                return true;
            }
        })
        .withMessage("Ensure the 'size' value is greater than or equal to 1"),

    // Validate the 'maxLat' parameter
    check("maxLat")
        .custom((value) => {
            if (value) {
                return parseInt(value) < 90 && parseInt(value) > -90;
            } else {
                return true;
            }
        })
        .custom((value, { req }) => {
            if (value && req.query.minLat) {
                return parseInt(value) > parseInt(req.query.minLat);
            }
            return true;
        })
        .withMessage("Verify the 'maxLat' falls within valid latitude range"),

    // Validate the 'minLat' parameter
    check("minLat")
        .custom((value) => {
            if (value) {
                return parseInt(value) < 90 && parseInt(value) > -90;
            } else {
                return true;
            }
        })
        .custom((value, { req }) => {
            if (value && req.query.maxLat) {
                return parseInt(value) < parseInt(req.query.maxLat);
            }
            return true;
        })
        .withMessage("Verify the 'minLat' falls within valid latitude range"),

    // Check the 'minLng' parameter
    check("minLng")
        .custom((value) => {
            if (value) {
                return parseInt(value) < 180 && parseInt(value) > -180;
            } else {
                return true;
            }
        })
        .custom((value, { req }) => {
            if (value && req.query.maxLng) {
                return parseInt(value) < parseInt(req.query.maxLng);
            }
            return true;
        })
        .withMessage("Ensure the 'minLng' is within valid longitude range"),

    // Check the 'maxLng' parameter
    check("maxLng")
        .custom((value) => {
            if (value) {
                return parseInt(value) < 180 && parseInt(value) > -180;
            } else {
                return true;
            }
        })
        .custom((value, { req }) => {
            if (value && req.query.minLng) {
                return parseInt(value) > parseInt(req.query.minLng);
            }
            return true;
        })
        .withMessage("Ensure the 'maxLng' is within valid longitude range"),

    // Validate the 'minPrice' parameter
    check("minPrice")
        .custom((value) => {
            if (value) {
                return parseInt(value) >= 0;
            } else {
                return true;
            }
        })
        .custom((value, { req }) => {
            if (value && req.query.maxPrice) {
                return parseInt(value) < parseInt(req.query.maxPrice);
            }
            return true;
        })
        .withMessage("Ensure the 'minPrice' is greater than or equal to 0"),

    // Validate the 'maxPrice' parameter
    check("maxPrice")
        .custom((value) => {
            if (value) {
                console.log(value);  // Logging the 'maxPrice' value
                return parseInt(value) >= 0;
            } else {
                return true;
            }
        })
        .custom((value, { req }) => {
            if (value && req.query.minPrice) {
                return parseInt(value) > parseInt(req.query.minPrice);
            }
            return true;
        })
        .withMessage("Ensure the 'maxPrice' is greater than or equal to 0"),

    // Custom handler for validation errors
    handleValidationErrors,
];


// Get all spots
router.get("/", )

module.exports = router
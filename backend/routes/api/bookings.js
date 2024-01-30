const express = require("express");
const { requireAuth } = require("../../utils/auth");
const router = express.Router();
const { Op } = require("sequelize");
const { Spot, Review, SpotImage, User, Booking, sequelize, ReviewImage, } = require("../../db/models");



module.exports = router
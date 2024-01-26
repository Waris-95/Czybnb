const express = require("express");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User,SpotImage,Review,sequelize,ReviewImage,Booking } = require ("../../db/models");
const router = express.Router();

// get all review o the current user


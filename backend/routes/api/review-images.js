const express = require("express");
const { requireAuth } = require("../../utils/auth");
const router = express.Router();
const { Op } = require("sequelize");
const { Review, ReviewImage } = require("../../db/models");

// delete a review image
router.delete("/:imageId", requireAuth, async (req, res, next) => {
    
})
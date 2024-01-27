const express = require("express");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User,SpotImage,Review,sequelize,ReviewImage,Booking } = require ("../../db/models");
const router = express.Router();

// get all review o the current user
router.get("/current", requireAuth, async (req, res, next) => {
    const { user } = req;
    try {
        // returns all the reviews written by a user
        const allReviews = await Review.findAll({
            where: { 
                userId: user.id
            },
            include: [
                {

                },
            ]
        })
    } catch (error) {

    }
})

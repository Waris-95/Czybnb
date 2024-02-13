"use strict";

const { Review } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        options.tableName = "Reviews";
        await Review.bulkCreate([
            {
                spotId: 1,
                userId: 3,
                review: "A magical experience! Would stay again and again!",
                stars: 5,
            },
            {
                spotId: 1,
                userId: 4,
                review: "Unexpectedly delightful. Can't wait to come back!",
                stars: 4,
            },
            {
                spotId: 1,
                userId: 2,
                review: "Absolutely amazing! Best times of my life!",
                stars: 5,
            },
            {
                spotId: 2,
                userId: 1,
                review: "Adventure awaits! Felt like a labyrinth of wonders.",
                stars: 3,
            },
            {
                spotId: 2,
                userId: 3,
                review: "Enchanting stay in a fairytale setting!",
                stars: 5,
            },
            {
                spotId: 3,
                userId: 1,
                review: "Just okay. Expected a bit more excitement.",
                stars: 3,
            },
            {
                spotId: 3,
                userId: 4,
                review: "Surprisingly decent. Pleasantly surprised!",
                stars: 4,
            },
            {
                spotId: 3,
                userId: 2,
                review: "Breathtaking views! Exceeded my expectations.",
                stars: 5,
            },
            {
                spotId: 4,
                userId: 1,
                review: "Tiny but cozy! Perfect for a magical retreat.",
                stars: 4,
            },
            {
                spotId: 4,
                userId: 2,
                review: "Owner added mystery with occasional window peeks!",
                stars: 2,
            },
            {
                spotId: 4,
                userId: 3,
                review: "Not as bad as others say. Unraveled hidden charm.",
                stars: 4,
            },
        ]);
    },
    
    async down(queryInterface, Sequelize) {
        options.tableName = "Reviews";
        const Op = Sequelize.Op;
        return queryInterface.bulkDelete(
            options,
            {
                review: {
                    [Op.in]: [
                        "A magical experience! Would stay again and again!",
                        "Unexpectedly delightful. Can't wait to come back!",
                        "Absolutely amazing! Best times of my life!",
                        "Adventure awaits! Felt like a labyrinth of wonders.",
                        "Enchanting stay in a fairytale setting!",
                        "Just okay. Expected a bit more excitement.",
                        "Surprisingly decent. Pleasantly surprised!",
                        "Breathtaking views! Exceeded my expectations.",
                        "Tiny but cozy! Perfect for a magical retreat.",
                        "Owner added mystery with occasional window peeks!",
                        "Not as bad as others say. Unraveled hidden charm.",
                    ],
                },
            },
            {}
        );
    },
};
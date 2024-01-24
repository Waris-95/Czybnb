"use strict";

const { ReviewImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        options.tableName = "ReviewImages";
        await ReviewImage.bulkCreate([
            {
                reviewId: 1,
                url: "https://images.pexels.com/photos/5778899/pexels-photo-5778899.jpeg?auto=compress&cs=tinysrgb&w=1200",
            },
            {
                reviewId: 2,
                url: "https://images.pexels.com/photos/4740509/pexels-photo-4740509.jpeg?auto=compress&cs=tinysrgb&w=1200",
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        options.tableName = "ReviewImages";
        const Op = Sequelize.Op;
        return queryInterface.bulkDelete(
            options,
            {
                url: {
                    [Op.in]: [
                      "https://images.pexels.com/photos/5778899/pexels-photo-5778899.jpeg?auto=compress&cs=tinysrgb&w=1200",
                      "https://images.pexels.com/photos/4740509/pexels-photo-4740509.jpeg?auto=compress&cs=tinysrgb&w=1200",
                    ],
                },
            },
            {}
        );
    },
};
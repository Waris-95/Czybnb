"use strict";

const { Booking } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        options.tableName = "Bookings";
        await Booking.bulkCreate(
            [
                {
                    spotId: 1,
                    userId: 2,
                    startDate: "2024-9-17",
                    endDate: "2024-10-23",
                },
                {
                    spotId: 1,
                    userId: 3,
                    startDate: "2024-11-13",
                    endDate: "2025-11-20",
                },
                {
                    spotId: 2,
                    userId: 3,
                    startDate: "2024-12-20",
                    endDate: "2024-2-2",
                },
                {
                    spotId: 4,
                    userId: 1,
                    startDate: "2024-8-13",
                    endDate: "2024-8-16",
                },
            ],
            { validate: true }
        );
    },

    async down(queryInterface, Sequelize) {
        options.tableName = "Bookings";
        const Op = Sequelize.Op;
        return queryInterface.bulkDelete(
            options,
            {
                startDate: {
                    [Op.in]: [
                      "2024-9-17",
                      "2024-11-13",
                      "2024-12-20",
                      "2024-8-13",
                    ],
                },
            },
            {}
        );
    },
};
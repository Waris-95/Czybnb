"use strict";

const { Booking } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

module.exports = {
    async up(queryInterface, Sequelize) {
        options.tableName = "Bookings";
        try {
            await Booking.bulkCreate(
                [
                    {
                        spotId: 1,
                        userId: 2,
                        startDate: new Date("2024-9-17"),
                        endDate: new Date("2024-10-23"),
                    },
                    {
                        spotId: 1,
                        userId: 3,
                        startDate: new Date("2024-11-13"),
                        endDate: new Date("2025-11-20"),
                    },
                    {
                        spotId: 2,
                        userId: 3,
                        startDate: new Date("2024-2-20"),
                        endDate: new Date("2024-12-2"),
                    },
                    {
                        spotId: 4,
                        userId: 1,
                        startDate: new Date("2024-8-13"),
                        endDate: new Date("2024-8-16"),
                    },
                ],
                { validate: true }
            );
        } catch (err) {
            console.log("### ERROR: ", err);
            throw Error(err);
        }
    },

    async down(queryInterface, Sequelize) {
        options.tableName = "Bookings";
        const Op = Sequelize.Op;
        return queryInterface.bulkDelete(
            options,
            {
                startDate: {
                    [Op.in]: [
                      new Date("2024-9-17"),
                      new Date("2024-11-13"),
                      new Date("2024-2-20"),
                      new Date("2024-8-13"),
                    ],
                },
            },
            {}
        );
    },
};

"use strict";

const { Spot } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        options.tableName = "Spots"; // Corrected the table name to "Spots"
        await Spot.bulkCreate(
          [
            {
              ownerId: 1,
              address: "456 New Street",
              city: "Cityville",
              state: "Texas",
              country: "United States",
              lat: 38.123456,
              lng: -120.987654,
              name: "New Home",
              description: "A modern space for a delightful stay.",
              price: 88.5,
            },
            {
              ownerId: 2,
              address: "987 Mountain View",
              city: "Scenic City",
              state: "Montana",
              country: "United States",
              lat: 45.678901,
              lng: -109.876543,
              name: "Mountain Retreat",
              description: "Escape to nature in this peaceful retreat.",
              price: 45.75,
            },
            {
              ownerId: 3,
              address: "1234 Lakeside Drive",
              city: "Waterside",
              state: "Florida",
              country: "United States",
              lat: 28.987654,
              lng: -81.234567,
              name: "Lakeside Haven",
              description: "Enjoy the serenity by the lake.",
              price: 64.2,
            },
            {
              ownerId: 2,
              address: "567 Tech Hub",
              city: "Innovation City",
              state: "California",
              country: "United States",
              lat: 37.765432,
              lng: -122.345678,
              name: "Tech Oasis",
              description: "An inspiring space for innovation.",
              price: 120.9,
            },
          ],
            { validate: true }
        );
    },

    async down(queryInterface, Sequelize) {
        // Corrected the table name to "Spot"
        options.tableName = "Spot";
        const Op = Sequelize.Op;
        return queryInterface.bulkDelete(
            options,
            {
                name: {
                    [Op.in]: [
                        "New Home",
                        "Mountain Retreate",
                        "Lakeside Haven",
                        "Tech Oasis",
                    ],
                },
            },
            {}
        );
    },
};
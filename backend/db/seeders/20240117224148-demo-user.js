"use strict";

const { User } = require("../models");
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await User.bulkCreate(
            [
                {
                    email: "demo@user.io",
                    username: "Demo-lition",
                    hashedPassword: bcrypt.hashSync("password"),
                    firstName: "Demo",
                    lastName: "User",
                },
                {
                    email: "me@my.self",
                    username: "myeself",
                    hashedPassword: bcrypt.hashSync("password2"),
                    firstName: "Mya",
                    lastName: "Self",
                },
                {
                    email: "holymackerel@gmail.com",
                    username: "HolyMackerel",
                    hashedPassword: bcrypt.hashSync("password3"),
                    firstName: "Holly",
                    lastName: "Mackerel",
                },
                {
                    email: "abdul@mail.us",
                    username: "dullyy",
                    hashedPassword: bcrypt.hashSync("password4"),
                    firstName: "Abdul",
                    lastName: "Waris",
                },
            ],
            { validate: true }
        );
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        options.tableName = "Users";
        const Op = Sequelize.Op;
        return queryInterface.bulkDelete(
            options,
            {
                username: {
                    [Op.in]: [
                        "Demo-lition",
                        "myeself",
                        "HolyMackerel",
                        "dullyy",
                    ],
                },
            },
            {}
        );
    },
};

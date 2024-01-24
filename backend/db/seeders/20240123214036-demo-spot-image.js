"use strict";

const { SpotImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "SpotImages";
    await SpotImage.bulkCreate(
      [
        {
          spotId: 1,
          url: "https://images.pexels.com/photos/5875837/pexels-photo-5875837.jpeg?auto=compress&cs=tinysrgb&w=1200",
          preview: true,
        },
        {
          spotId: 1,
          url: "https://images.pexels.com/photos/3933020/pexels-photo-3933020.jpeg?auto=compress&cs=tinysrgb&w=1200",
          preview: false,
        },
        {
          spotId: 1,
          url: "https://images.pexels.com/photos/4112236/pexels-photo-4112236.jpeg?auto=compress&cs=tinysrgb&w=1200",
          preview: false,
        },
        {
          spotId: 2,
          url: "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=1200",
          preview: true,
        },
        {
          spotId: 2,
          url: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200",
          preview: false,
        },
        {
          spotId: 2,
          url: "https://images.pexels.com/photos/280232/pexels-photo-280232.jpeg?auto=compress&cs=tinysrgb&w=1200",
          preview: false,
        },
        {
          spotId: 3,
          url: "https://images.pexels.com/photos/2335490/pexels-photo-2335490.jpeg?auto=compress&cs=tinysrgb&w=1200",
          preview: true,
        },
        {
          spotId: 3,
          url: "https://images.pexels.com/photos/2343468/pexels-photo-2343468.jpeg?auto=compress&cs=tinysrgb&w=1200",
          preview: false,
        },
        {
          spotId: 3,
          url: "https://images.pexels.com/photos/2208891/pexels-photo-2208891.jpeg?auto=compress&cs=tinysrgb&w=1200",
          preview: false,
        },
        {
          spotId: 4,
          url: "https://images.pexels.com/photos/3164593/pexels-photo-3164593.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          preview: true,
        },
        {
          spotId: 4,
          url: "https://images.pexels.com/photos/5490199/pexels-photo-5490199.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          preview: false,
        },
        {
          spotId: 4,
          url: "https://images.pexels.com/photos/4857776/pexels-photo-4857776.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          preview: false,
        },
      ],
      { validate: true }
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "SpotImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        url: {
          [Op.in]: [
            "https://images.pexels.com/photos/4857776/pexels-photo-4857776.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            "https://images.pexels.com/photos/5490199/pexels-photo-5490199.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            "https://images.pexels.com/photos/3164593/pexels-photo-3164593.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",

            "https://images.pexels.com/photos/2208891/pexels-photo-2208891.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.pexels.com/photos/2343468/pexels-photo-2343468.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.pexels.com/photos/2335490/pexels-photo-2335490.jpeg?auto=compress&cs=tinysrgb&w=1200",

            "https://images.pexels.com/photos/280232/pexels-photo-280232.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=1200",

            "https://images.pexels.com/photos/4112236/pexels-photo-4112236.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.pexels.com/photos/3933020/pexels-photo-3933020.jpeg?auto=compress&cs=tinysrgb&w=1200",
          ],
        },
      },
      {}
    );
  },
};
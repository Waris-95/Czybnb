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
        {
          spotId: 5,
          url: "https://images.pexels.com/photos/3560088/pexels-photo-3560088.jpeg?auto=compress&cs=tinysrgb&w=1200",
          preview: true,
        },
        {
          spotId: 5,
          url: "https://images.pexels.com/photos/3493744/pexels-photo-3493744.jpeg?auto=compress&cs=tinysrgb&w=1200",
          preview: false,
        },
        {
          spotId: 5,
          url: "https://images.pexels.com/photos/3641069/pexels-photo-3641069.jpeg?auto=compress&cs=tinysrgb&w=1200",
          preview: false,
        },
        {
          spotId: 6,
          url: "https://images.pexels.com/photos/3573883/pexels-photo-3573883.jpeg?auto=compress&cs=tinysrgb&w=1200",
          preview: true,
        },
        {
          spotId: 6,
          url: "https://images.pexels.com/photos/3586956/pexels-photo-3586956.jpeg?auto=compress&cs=tinysrgb&w=1200",
          preview: false,
        },
        {
          spotId: 6,
          url: "https://images.pexels.com/photos/3616973/pexels-photo-3616973.jpeg?auto=compress&cs=tinysrgb&w=1200",
          preview: false,
        },
        {
          spotId: 7,
          url: "https://images.pexels.com/photos/3586953/pexels-photo-3586953.jpeg?auto=compress&cs=tinysrgb&w=1200",
          preview: true,
        },
        {
          spotId: 7,
          url: "https://images.pexels.com/photos/3640943/pexels-photo-3640943.jpeg?auto=compress&cs=tinysrgb&w=1200",
          preview: false,
        },
        {
          spotId: 7,
          url: "https://images.pexels.com/photos/3586950/pexels-photo-3586950.jpeg?auto=compress&cs=tinysrgb&w=1200",
          preview: false,
        },
        {
          spotId: 8,
          url: "https://images.pexels.com/photos/3586935/pexels-photo-3586935.jpeg?auto=compress&cs=tinysrgb&w=1200",
          preview: true,
        },
        {
          spotId: 8,
          url: "https://images.pexels.com/photos/3586945/pexels-photo-3586945.jpeg?auto=compress&cs=tinysrgb&w=1200",
          preview: false,
        },
        {
          spotId: 8,
          url: "https://images.pexels.com/photos/3586951/pexels-photo-3586951.jpeg?auto=compress&cs=tinysrgb&w=1200",
          preview: false,
        },
        {
          spotId: 9,
          url: "https://images.pexels.com/photos/3586957/pexels-photo-3586957.jpeg?auto=compress&cs=tinysrgb&w=1200",
          preview: true,
        },
        {
          spotId: 9,
          url: "https://images.pexels.com/photos/3586952/pexels-photo-3586952.jpeg?auto=compress&cs=tinysrgb&w=1200",
          preview: false,
        },
        {
          spotId: 9,
          url: "https://images.pexels.com/photos/3641060/pexels-photo-3641060.jpeg?auto=compress&cs=tinysrgb&w=1200",
          preview: false,
        },
        {
          spotId: 10,
          url: "https://images.pexels.com/photos/3586955/pexels-photo-3586955.jpeg?auto=compress&cs=tinysrgb&w=1200",
          preview: true,
        },
        {
          spotId: 10,
          url: "https://images.pexels.com/photos/3586959/pexels-photo-3586959.jpeg?auto=compress&cs=tinysrgb&w=1200",
          preview: false,
        },
        {
          spotId: 10,
          url: "https://images.pexels.com/photos/3586948/pexels-photo-3586948.jpeg?auto=compress&cs=tinysrgb&w=1200",
          preview: false,
        },
        {
          spotId: 11,
          url: "https://images.pexels.com/photos/3586944/pexels-photo-3586944.jpeg?auto=compress&cs=tinysrgb&w=1200",
          preview: true,
        },
        {
          spotId: 11,
          url: "https://images.pexels.com/photos/3586958/pexels-photo-3586958.jpeg?auto=compress&cs=tinysrgb&w=1200",
          preview: false,
        },
        {
          spotId: 11,
          url: "https://images.pexels.com/photos/3586949/pexels-photo-3586949.jpeg?auto=compress&cs=tinysrgb&w=1200",
          preview: false,
        },
        {
          spotId: 12,
          url: "https://images.pexels.com/photos/3586954/pexels-photo-3586954.jpeg?auto=compress&cs=tinysrgb&w=1200",
          preview: true,
        },
        {
          spotId: 12,
          url: "https://images.pexels.com/photos/3586947/pexels-photo-3586947.jpeg?auto=compress&cs=tinysrgb&w=1200",
          preview: false,
        },
        {
          spotId: 12,
          url: "https://images.pexels.com/photos/3586953/pexels-photo-3586953.jpeg?auto=compress&cs=tinysrgb&w=1200",
          preview: false,
        },
        {
          spotId: 13,
          url: "https://images.pexels.com/photos/3586946/pexels-photo-3586946.jpeg?auto=compress&cs=tinysrgb&w=1200",
          preview: true,
        },
        {
          spotId: 13,
          url: "https://images.pexels.com/photos/3586952/pexels-photo-3586952.jpeg?auto=compress&cs=tinysrgb&w=1200",
          preview: false,
        },
        {
          spotId: 13,
          url: "https://images.pexels.com/photos/3586945/pexels-photo-3586945.jpeg?auto=compress&cs=tinysrgb&w=1200",
          preview: false,
        },
        {
          spotId: 14,
          url: "https://images.pexels.com/photos/3586951/pexels-photo-3586951.jpeg?auto=compress&cs=tinysrgb&w=1200",
          preview: true,
        },
        {
          spotId: 14,
          url: "https://images.pexels.com/photos/3586959/pexels-photo-3586959.jpeg?auto=compress&cs=tinysrgb&w=1200",
          preview: false,
        },
        {
          spotId: 14,
          url: "https://images.pexels.com/photos/3586957/pexels-photo-3586957.jpeg?auto=compress&cs=tinysrgb&w=1200",
          preview: false,
        },
        {
          spotId: 15,
          url: "https://images.pexels.com/photos/3586956/pexels-photo-3586956.jpeg?auto=compress&cs=tinysrgb&w=1200",
          preview: true,
        },
        {
          spotId: 15,
          url: "https://images.pexels.com/photos/3586958/pexels-photo-3586958.jpeg?auto=compress&cs=tinysrgb&w=1200",
          preview: false,
        },
        {
          spotId: 15,
          url: "https://images.pexels.com/photos/3586954/pexels-photo-3586954.jpeg?auto=compress&cs=tinysrgb&w=1200",
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
            "https://images.pexels.com/photos/5875837/pexels-photo-5875837.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.pexels.com/photos/3933020/pexels-photo-3933020.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.pexels.com/photos/4112236/pexels-photo-4112236.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.pexels.com/photos/280232/pexels-photo-280232.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.pexels.com/photos/2335490/pexels-photo-2335490.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.pexels.com/photos/2343468/pexels-photo-2343468.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.pexels.com/photos/2208891/pexels-photo-2208891.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.pexels.com/photos/3164593/pexels-photo-3164593.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            "https://images.pexels.com/photos/5490199/pexels-photo-5490199.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            "https://images.pexels.com/photos/4857776/pexels-photo-4857776.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
            "https://images.pexels.com/photos/3560088/pexels-photo-3560088.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.pexels.com/photos/3493744/pexels-photo-3493744.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.pexels.com/photos/3641069/pexels-photo-3641069.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.pexels.com/photos/3573883/pexels-photo-3573883.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.pexels.com/photos/3586956/pexels-photo-3586956.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.pexels.com/photos/3616973/pexels-photo-3616973.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.pexels.com/photos/3586953/pexels-photo-3586953.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.pexels.com/photos/3640943/pexels-photo-3640943.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.pexels.com/photos/3586950/pexels-photo-3586950.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.pexels.com/photos/3586935/pexels-photo-3586935.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.pexels.com/photos/3586945/pexels-photo-3586945.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.pexels.com/photos/3586951/pexels-photo-3586951.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.pexels.com/photos/3586957/pexels-photo-3586957.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.pexels.com/photos/3586959/pexels-photo-3586959.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.pexels.com/photos/3586944/pexels-photo-3586944.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.pexels.com/photos/3586958/pexels-photo-3586958.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.pexels.com/photos/3586949/pexels-photo-3586949.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.pexels.com/photos/3586954/pexels-photo-3586954.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.pexels.com/photos/3586947/pexels-photo-3586947.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.pexels.com/photos/3586946/pexels-photo-3586946.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.pexels.com/photos/3586952/pexels-photo-3586952.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.pexels.com/photos/3586945/pexels-photo-3586945.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.pexels.com/photos/3586951/pexels-photo-3586951.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.pexels.com/photos/3586959/pexels-photo-3586959.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.pexels.com/photos/3586957/pexels-photo-3586957.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.pexels.com/photos/3586956/pexels-photo-3586956.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.pexels.com/photos/3586958/pexels-photo-3586958.jpeg?auto=compress&cs=tinysrgb&w=1200",
            "https://images.pexels.com/photos/3586954/pexels-photo-3586954.jpeg?auto=compress&cs=tinysrgb&w=1200",
          ],
        },
      },
      {}
    );
  },
};

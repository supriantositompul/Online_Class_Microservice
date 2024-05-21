"use strict";
const bcrypt = require("bcrypt");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert("users", [{
                name: "suprianto",
                profession: "Admin Micro",
                role: "admin",
                email: "suprianto@gmail.com",
                password: await bcrypt.hash("rahasia1234", 10),
                created_At: new Date(),
                updated_At: new Date(),
            },
            {
                name: "dharma",
                profession: "Backend Engineer",
                role: "student",
                email: "dharma@gmail.comm",
                password: await bcrypt.hash("student123", 10),
                created_At: new Date(),
                updated_At: new Date(),
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("users", null, {});
    },
};
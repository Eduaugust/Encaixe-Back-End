import express from "express";
const routes = express.Router();
const userController = require('../controller/userController')

routes.post('/', userController.post)

module.exports = routes;
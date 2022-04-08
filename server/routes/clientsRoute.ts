import express from "express";
const routes = express.Router();
const clientsController = require('../controller/clientsController')

routes.get('/', clientsController.get)

routes.post('/', clientsController.post)

routes.put('/', clientsController.put)

routes.delete('/:id', clientsController.deleteById)

routes.delete('/', clientsController.delete)


module.exports = routes;
import express from "express";
const routes = express.Router();
const clientsController = require('../controller/clientsController')

routes.get('/', clientsController.get)

routes.get('/:date', clientsController.getByDay)

routes.post('/', clientsController.post)

routes.put('/:id', clientsController.put)

routes.delete('/:id', clientsController.deleteById)

routes.delete('/', clientsController.delete)


module.exports = routes;
import express from "express";
const routes = express.Router();
import * as clientsController from "../controller/clientsController";
import * as authMiddleware from "../middlewares/auth";

// Aplicando middleware de autenticação em todas as rotas de clients
routes.use(authMiddleware.format);

routes.get('/', clientsController.get)

routes.get('/:date', clientsController.getByDay)

routes.post('/', clientsController.post)

routes.put('/:id', clientsController.put)

routes.delete('/:id', clientsController.deleteById)

routes.delete('/', authMiddleware.user_admin, clientsController.deleteClient) // Apenas admin pode excluir todos

export { routes as clientsRoute };
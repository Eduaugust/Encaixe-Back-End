import express from "express";
const routes = express.Router();
import * as serviceController from "../controller/serviceController";
import * as authMiddleware from "../middlewares/auth";

// Aplicando middleware de autenticação em todas as rotas
routes.use(authMiddleware.format);

// Rota para listar todos os serviços
routes.get('/', serviceController.getAll);

// Rota para buscar serviço por ID
routes.get('/:id', serviceController.getById);

// Rotas que exigem privilégios de ADMIN
routes.post('/', authMiddleware.user_admin, serviceController.create);
routes.put('/:id', authMiddleware.user_admin, serviceController.update);
routes.delete('/:id', authMiddleware.user_admin, serviceController.remove);

export { routes as serviceRoute };

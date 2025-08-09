import express from "express";
const routes = express.Router();
import * as companyController from "../controller/companyController";
import * as authMiddleware from "../middlewares/auth";

// Aplicando middleware de autenticação em todas as rotas
routes.use(authMiddleware.format);

// Rotas que exigem privilégios de ADMIN
routes.post('/', authMiddleware.user_admin, companyController.create);
routes.put('/:id', authMiddleware.user_admin, companyController.update);
routes.delete('/:id', authMiddleware.user_admin, companyController.remove);

// Rotas que qualquer usuário autenticado pode acessar
routes.get('/', companyController.getAll);
routes.get('/:id', companyController.getById);

export { routes as companyRoute };

import express from "express";
const routes = express.Router();
import * as clientsController from "../controller/clientsController";
import * as authMiddleware from "../middlewares/auth";

// Aplicando middleware de autenticação em todas as rotas de clients
routes.use(authMiddleware.format);

// Listar todos os clientes
routes.get('/', clientsController.getAll);

// Buscar cliente por ID
routes.get('/:id', clientsController.getById);

// Buscar clientes por usuário
routes.get('/user/:userId', clientsController.getByUserId);

// Criar novo cliente
routes.post('/', clientsController.create);

// Atualizar cliente
routes.put('/:id', clientsController.update);

// Remover cliente específico
routes.delete('/:id', clientsController.remove);

// Remover todos os clientes (apenas admin)
routes.delete('/', authMiddleware.user_admin, clientsController.removeAll);

export { routes as clientsRoute };
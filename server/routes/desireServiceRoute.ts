import express from "express";
const routes = express.Router();
import * as desireServiceController from "../controller/desireServiceController";
import * as authMiddleware from "../middlewares/auth";

// Aplicando middleware de autenticação em todas as rotas
routes.use(authMiddleware.format);

// Listagem de todos os desejos de serviço
routes.get('/', desireServiceController.getAll);

// Busca por ID
routes.get('/:id', desireServiceController.getById);

// Busca por cliente
routes.get('/client/:clientId', desireServiceController.getByClientId);

// Busca por tipo de serviço
routes.get('/service/:serviceId', desireServiceController.getByServiceId);

// Busca por dia da semana
routes.get('/day/:day', desireServiceController.getByDay);

// Criar novo desejo de serviço
routes.post('/', desireServiceController.create);

// Atualizar desejo de serviço
routes.put('/:id', desireServiceController.update);

// Remover desejo de serviço
routes.delete('/:id', desireServiceController.remove);

export { routes as desireServiceRoute };

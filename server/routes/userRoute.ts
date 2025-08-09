import express from "express";
const routes = express.Router();
import * as userController from "../controller/userController";
import * as authMiddleware from "../middlewares/auth";

// Rota pública de login
routes.post('/login', userController.login);

// Rota pública de registro (para o primeiro usuário ADMIN)
// routes.post('/register', userController.register);

// Middleware de autenticação para as rotas a seguir
routes.use(authMiddleware.format);

// Rotas que exigem autenticação
routes.get('/', userController.getAll);
routes.get('/profile', userController.getProfile); // Perfil do usuário logado
routes.get('/:id', userController.getById);

// Rotas que exigem privilégios de ADMIN
routes.post('/', authMiddleware.user_admin, userController.create);
routes.put('/:id', authMiddleware.user_admin, userController.update);
routes.delete('/:id', authMiddleware.user_admin, userController.remove);

// Rotas que exigem privilégios de SUPER_ADMIN
routes.post('/super-admin/company', authMiddleware.super_admin, userController.createCompany);

// Rota para o usuário atualizar seu próprio perfil
routes.put('/profile/update', userController.updateProfile);

export { routes as userRoute };
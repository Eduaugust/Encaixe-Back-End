import express from "express";
const routes = express.Router();
import * as userController from "../controller/userController";
import * as authMiddleware from "../middlewares/auth";

// Rota pública de login
routes.post('/login', userController.login)

// Rota protegida que requer autenticação e privilégios de admin
routes.post('/', authMiddleware.format, authMiddleware.user_admin, userController.post)

export { routes as userRoute };
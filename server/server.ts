import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { indexRoute } from './routes/indexRoute';
import { userRoute } from './routes/userRoute';
import { clientsRoute } from './routes/clientsRoute';
import { companyRoute } from './routes/companyRoute';
import { serviceRoute } from './routes/serviceRoute';
import { desireServiceRoute } from './routes/desireServiceRoute';

const server = express();

// Middlewares globais
server.use(cors({
  origin: '*',
}));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Definição de rotas
server.use('/', indexRoute);
server.use('/users', userRoute);
server.use('/clients', clientsRoute);
server.use('/companies', companyRoute);
server.use('/services', serviceRoute);
server.use('/desire-services', desireServiceRoute);

// Middleware de tratamento de erros
server.use((err: any, req: any, res: any, next: any) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
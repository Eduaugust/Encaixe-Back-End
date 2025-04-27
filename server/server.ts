import express from 'express';
import cors from 'cors';
import {clientsRoute} from './routes/clientsRoute';
import 'dotenv/config';
import { indexRoute } from './routes/indexRoute';
import { userRoute } from './routes/userRoute';

const server = express();

server.use(cors());
server.use(express.json());

server.use('/',  indexRoute);
server.use('/user', userRoute);
server.use('/clients', clientsRoute);

server.listen(process.env.PORT, () => {
    console.log(`Servidor rodando na porta ${process.env.PORT}`);
});
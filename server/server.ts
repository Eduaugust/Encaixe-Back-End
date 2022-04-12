const express = require('express');
const server = express();
const cors = require("cors");
const indexRoute = require('./routes/indexRoute');
// const userRoute = require('./routes/userRoute');
const clientsRoute = require('./routes/clientsRoute');
require('dotenv').config()

server.use(cors());
server.use(express.json());

server.use('/', indexRoute)

server.use('/clients', clientsRoute)

server.listen(process.env.PORT, () => {
    console.log(`Servidor rodando na porta ${process.env.PORT}`);
});
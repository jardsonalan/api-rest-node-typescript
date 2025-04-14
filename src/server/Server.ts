import express from 'express';
import { router } from './routes';

// Instância do servidor
const server = express()

// Serve para apresentar os dados, passados no Body, no terminal
server.use(express.json())

// Indica que nosso server irá fazer uso das rotas que estão no router
server.use(router)

export { server }
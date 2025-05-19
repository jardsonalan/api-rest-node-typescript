import express from 'express';
import cors from 'cors'
import 'dotenv/config'
import './shared/services/TranslationsYup'
import { router } from './routes';

// Instância do servidor
const server = express()

// Configuração do cors
server.use(cors({
  // origin: endereços que podem fazer chamadas para o backend
  origin: process.env.ENABLED_CORS?.split(';') || []
}))

// Serve para apresentar os dados, passados no Body, no terminal
server.use(express.json())

// Indica que nosso server irá fazer uso das rotas que estão no router
server.use(router)

export { server }
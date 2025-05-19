import knex from "knex";
import pg from 'pg'
import 'dotenv/config'
import { development, production, test } from "./Environment";

// Verifica se a aplicação está rodando em produção
if (process.env.NODE_ENV === 'production') {
  // Faz o tratamento dos dados como inteiro
  pg.types.setTypeParser(20, 'text', parseInt)
}

const getEnvironment = () => {
    switch (process.env.NODE_ENV) {
        case 'production': return production

        case 'test': return test
        
        default: return development
    }
}

export const Knex = knex(getEnvironment())
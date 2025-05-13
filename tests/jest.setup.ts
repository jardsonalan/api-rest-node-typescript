// Importação da biblioteca supertest
import supertest from "supertest";
// Importação do server
import { server } from "../src/server/Server";
import { Knex } from "../src/server/database/knex";

// Serve para esperar o Knex criar as migrações das tabelas, antes de rodar os testes
beforeAll(async () => {
  await Knex.migrate.latest()
  await Knex.seed.run()
})

// Serve para esperar a desconexão com o Knex, após os testes, e não ficar uma conexão ligada após encerrar os testes
afterAll(async () => {
  await Knex.destroy()
})

// Exportação da variável que irá servir para realizar os testes
export const testServer = supertest(server)
// Importação da biblioteca supertest
import supertest from "supertest";
// Importação do server
import { server } from "../src/server/Server";

// Exportação da variável que irá servir para realizar os testes
export const testServer = supertest(server)
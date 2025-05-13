import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

// Serve para criar a tabela pessoas
export async function up(knex: Knex) {
    return knex
    .schema
    .createTable(ETableNames.pessoa, table => {
        table.bigIncrements('id').primary().index()
        table.string('nome').index().notNullable()
        table.string('sobrenome').index().notNullable()
        table.string('email').unique().notNullable()
        
        // Chave estrangeira que referência a tabela de cidades
        table.bigInteger('cidadeId')
          .index()
          .notNullable()
          .references('id') // Informa que está fazendo referência com outro campo
          .inTable(ETableNames.cidade) // Informa a tabela onde está o campo referenciado
          .onUpdate('CASCADE') // Significa que se a cidade referenciada nessa tabela, for substituída na tabela de cidades
          // O SQL vai modificar o valor que está presente na tabela de pessoas
          .onDelete('RESTRICT') // Caso tente apagar um registro da tabela de cidades, e esse registro esteja vinculado a alguma pessoa da tabela de pessoas, não será permitido

        table.comment('Tabela usada para armazenar pessoas do sistema.')
    })
    .then(() => {
        console.log(`# Created table ${ETableNames.pessoa}`)
    })
}

// Serve para deletar a tabela pessoas
export async function down(knex: Knex) {
    return knex.schema
    .dropTable(ETableNames.pessoa)
    .then(() => {
        console.log(`# Dropped table ${ETableNames.pessoa}`)
    })
}
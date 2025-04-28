import type { Knex } from "knex";
import { ETableNames } from "../ETableNames";

// Serve para criar a tabela cidades
export async function up(knex: Knex) {
    return knex
    .schema
    .createTable(ETableNames.cidade, table => {
        table.bigIncrements('id').primary().index()
        table.string('nome', 150).checkLength('<=', 150).index().notNullable()

        table.comment('Tabela usada para armazenar cidades do sistema.')
    })
    .then(() => {
        console.log(`# Created table ${ETableNames.cidade}`)
    })
}

// Serve para deletar a tabela cidades
export async function down(knex: Knex) {
    return knex.schema
    .dropTable(ETableNames.cidade)
    .then(() => {
        console.log(`# Dropped table ${ETableNames.cidade}`)
    })
}
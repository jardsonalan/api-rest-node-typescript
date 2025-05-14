import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { IPessoa } from "../../models";

export const getAll = async (page: number, limit: number, filter: string): Promise<IPessoa[] | Error> => {
  try {
    const result = await Knex(ETableNames.pessoa)
    .select('*')
    .orWhere('nome', 'like', `%${filter}%`) // Retorna todas as pessoas que tiverem algo parecido com o filter
    .orWhere('sobrenome', 'like', `%${filter}%`)
    .offset((page - 1) * limit) // Serve para informar quais registros serão mostrados, ex.: 1-10, 2-8, ...
    .limit(limit) // Limita quantos registros são retornados


    return result
  } catch (error) {
    console.log(error)
    return new Error('Erro ao consultar os registros')
  }
}
import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { ICidade } from "../../models";

export const getAll = async (page: number, limit: number, filter: string, id = 0): Promise<ICidade[] | Error> => {
  try {
    const result = await Knex(ETableNames.cidade)
    .select('*')
    .where('id', Number(id)) // Verifica se o id de um registro é igual o id informado
    .orWhere('nome', 'like', `%${filter}%`) // Retorna todas as cidades que tiverem algo parecido com o filter
    .offset((page - 1) * limit) // Serve para informar quais registros serão mostrados, ex.: 1-10, 2-8, ...
    .limit(limit) // Limita quantos registros são retornados

    // Verificação para caso o id fornecido no parâmetro não seja encontrado na primeira consulta
    if (id > 0 && result.every(item => item.id !== id)) {
      const resultById = await Knex(ETableNames.cidade)
      .select('*')
      .where('id', '=', id)
      .first()

      if (resultById) return [...result, resultById]
    }

    return result
  } catch (error) {
    console.log(error)
    return new Error('Erro ao consultar os registros')
  }
}
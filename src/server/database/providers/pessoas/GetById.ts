import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { IPessoa } from "../../models";

export const getById = async (id: number): Promise<IPessoa | Error> => {
  try {
    const result = await Knex(ETableNames.pessoa)
    .select('*') // Informa que queremos selecionar todos os dados
    .where('id', '=', id) // Verifica se o id informado está presente em algum registro
    .first() // Serve para que retorne apenas o primeiro registro que ele encontrar na lista

    // Retorna os dados, caso existam na tabela
    if (result) return result

    // Retorna um erro, se os dados não existirem
    return new Error('Registro não encontrado')
  } catch (error) {
    console.log(error)
    return new Error('Erro ao consultar o registro')
  }
}
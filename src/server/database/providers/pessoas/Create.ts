import { ETableNames } from "../../ETableNames"
import { Knex } from "../../knex"
import { IPessoa } from "../../models"

// Serve para criar/cadastrar uma pessoa no banco de dados
export const create = async (pessoa: Omit<IPessoa, 'id'>): Promise<number | Error> => {
  try {
    // Serve para verificar se a cidade informado no cidadeId, da tabela de pessoas, existe na tabela de cidades
    const [{ count }] = await Knex(ETableNames.cidade)
    .where('id', '=', pessoa.cidadeId)
    .count<[{ count: number }]>('* as count')

    if (count === 0) {
      return new Error('A cidade usada no cadastro não foi encontrada')
    }

    const [result] = await Knex(ETableNames.pessoa).insert(pessoa).returning('id')
    // Verifica se o result retorna um objeto
    if (typeof result === 'object') {
      return result.id // Caso retorne um objeto, pega apenas o id
    // Verifica se o result retorna um number
    } else if (typeof result === 'number') {
      return result // Caso retorne um number, retorna o number
    }
    // Se não ocorrer nenhuma das opções acima, retorna um error
    return new Error('Erro ao cadastrar o registro')

  } catch (error) {
    console.log(error)
    return Error('Erro ao cadastrar o registro')
  }
}
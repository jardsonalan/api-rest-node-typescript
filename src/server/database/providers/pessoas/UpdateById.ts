import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { IPessoa } from "../../models";

export const updateById = async(id: number, pessoa: Omit<IPessoa, 'id'>): Promise<void | Error> => {
  try {
    const [{ count }] = await Knex(ETableNames.cidade)
    .where('id', '=', pessoa.cidadeId)
    .count<[{ count: number }]>('* as count')

    if (count === 0) {
      return new Error('A cidade usada no cadastro não foi encontrada')
    }

    const result = await Knex(ETableNames.pessoa)
    .update(pessoa) // Atualiza o registro
    .where('id', '=', id) // Verifica se o id informado é igual ao id que existe em algum registro no banco

    // Verifica se o valor do result é maior que 0 e retorna que o registro foi atualizado com sucesso
    if (result > 0) return

    // Gera um erro, caso não consiga atualizar o registro
    return new Error('Erro ao atualizar o registro')
  } catch (error) {
    console.log(error)
    return new Error('Erro ao atualizar o registro')
  }
}
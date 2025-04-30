import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";
import { ICidade } from "../../models";

export const updateById = async(id: number, cidade: Omit<ICidade, 'id'>): Promise<void | Error> => {
  try {
    const result = await Knex(ETableNames.cidade)
    .update(cidade) // Atualiza o registro
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
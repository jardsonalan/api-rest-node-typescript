import { ETableNames } from "../../ETableNames";
import { Knex } from "../../knex";

// Serve para deletar um registro através do seu id
export const deleteById = async (id: number): Promise<void | Error> => {
  try {
    // result: recebe 1 se o registro foi apagado com sucesso e 0 se deu erro ao apagar o registro
    const result = await Knex(ETableNames.pessoa)
    .where('id', '=', id) // Verifica se o id informado é igual a um id da tabela
    .del() // Deleta o registro da tabela

    // Verifica se o valor do result é maior que 0 e retorna que o registro foi apagado com sucesso
    if (result > 0) return

    // Se o id informado não existir, retorna um erro
    return new Error('Erro ao deletar o registro')
  } catch (error) {
    console.log(error)
    return new Error('Erro ao deletar o registro')
  }
}
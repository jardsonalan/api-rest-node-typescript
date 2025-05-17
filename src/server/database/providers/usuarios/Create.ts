import { PasswordCrypto } from "../../../shared/services"
import { ETableNames } from "../../ETableNames"
import { Knex } from "../../knex"
import { IUsuario } from "../../models"

// Serve para criar/cadastrar um usuário no banco de dados
export const create = async (usuario: Omit<IUsuario, 'id'>): Promise<number | Error> => {
  try {
    const hashedPassword = await PasswordCrypto.hashPassword(usuario.senha)

    const [result] = await Knex(ETableNames.usuario).insert({ ...usuario, senha: hashedPassword }).returning('id')

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
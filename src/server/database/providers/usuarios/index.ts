import * as create from './Create'
import * as getByEmail from './GetByEmail'

export const UsuariosProvider = {
    // Utiliza o spread para retornar todos os métodos exportados de um arquivo
    ...create,
    ...getByEmail,
}
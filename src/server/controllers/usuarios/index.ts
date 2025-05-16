// index.ts - serve para agrupar todas as controllers em uma única variável

// Faz com que possamos utilizar todos os métodos exportados de um arquivo
import * as signIn from './SignIn'
import * as signUp from './SignUp'

// Simplifica o uso das Controllers no arquivo de rotas
export const UsuariosController = {
  // Utiliza o spread para retornar todos os métodos exportados de um arquivo
  ...signIn,
  ...signUp
}
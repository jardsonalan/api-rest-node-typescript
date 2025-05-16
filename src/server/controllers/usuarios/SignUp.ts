import { Request, Response } from "express";
// Biblioteca para fazer validação de dados
import * as yup from 'yup'
import { validation } from "../../shared/middlewares";
import { StatusCodes } from "http-status-codes";
import { IUsuario } from "../../database/models";
import { UsuariosProvider } from "../../database/providers/usuarios";

// Omit: serve para omitir/esconder algum campo
interface IBodyProps extends Omit<IUsuario, 'id'> {}

// Middleware de validação
// 1° parâmetro: tipo da validação
// 2° parâmetro: schema da validação
// Método de validation que consegue forçar o yup a assumir uma característica específica
export const signUpValidation = validation((getSchema) => ({
  // Schema de validação
  body: getSchema<IBodyProps>(yup.object().shape({
    nome: yup.string().required().min(3),
    email: yup.string().required().email().min(5),
    senha: yup.string().required().min(6),
  })),
}))

// Controller de criação de usuários
// Esse método só será executado, se os dados passarem na validação do middleware
// Tipando o tipo da request - informando que os dados, que o request irá receber, serão os que estão na interface IUsuario
export const signUp = async (req: Request<{}, {}, IBodyProps>, res: Response) => {
  // Tentativa de criar um usuário
  // Retorna se a criação do usuário foi bem sucedida, ou não, dentro do result
  const result = await UsuariosProvider.create(req.body)

  // Verifica se result é uma instância de um Error
  // Ou seja, se tiver acontecido algum error
  if (result instanceof Error) {
    // Retorna um error interno de servidor, com uma mensagem de error padrão
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message
      }
    })
  }
  
  // Caso a criação foi bem sucedida, retorna o result em um json
  return res.status(StatusCodes.CREATED).json(result)
}
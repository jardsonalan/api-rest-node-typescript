import { Request, Response } from "express";
// Biblioteca para fazer validação de dados
import * as yup from 'yup'
import { validation } from "../../shared/middlewares";
import { StatusCodes } from "http-status-codes";
import { IPessoa } from "../../database/models";
import { PessoasProvider } from "../../database/providers/pessoas";

// Omit: serve para omitir/esconder algum campo
interface IBodyProps extends Omit<IPessoa, 'id'> {}

// Middleware de validação
// 1° parâmetro: tipo da validação
// 2° parâmetro: schema da validação
// Método de validation que consegue forçar o yup a assumir uma característica específica
export const createValidation = validation((getSchema) => ({
  // Schema de validação
  body: getSchema<IBodyProps>(yup.object().shape({
    nome: yup.string().required().min(3),
    sobrenome: yup.string().required().min(3),
    email: yup.string().required().email(),
    cidadeId: yup.number().integer().required().min(1),
  })),
}))

// Controller de criação de pessoas
// Esse método só será executado, se os dados passarem na validação do middleware
// Tipando o tipo da request - informando que os dados, que o request irá receber, serão os que estão na interface IPessoa
export const create = async (req: Request<{}, {}, IBodyProps>, res: Response) => {
  // Tentativa de criar uma pessoa
  // Retorna se a criação da pessoa foi bem sucedida, ou não, dentro do result
  const result = await PessoasProvider.create(req.body)

  // Verifica se result é uma instância de um Error
  // Ou seja, se tiver acontecido algum error
  if (result instanceof Error) {
    // Retorna um error interno de servidor, com uma mensagem de error padrão
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        dafault: result.message
      }
    })
  }
  
  // Caso a criação foi bem sucedida, retorna o result em um json
  return res.status(StatusCodes.CREATED).json(result)
}
import { Request, Response } from "express";
// Biblioteca para fazer validação de dados
import * as yup from 'yup'
import { validation } from "../../shared/middlewares";
import { StatusCodes } from "http-status-codes";
import { ICidade } from "../../database/models";
import { CidadesProvider } from "../../database/providers/cidades";

// Omit: serve para omitir/esconder algum campo
interface IBodyProps extends Omit<ICidade, 'id'> {}

// Middleware de validação
// 1° parâmetro: tipo da validação
// 2° parâmetro: schema da validação
// Método de validation que consegue forçar o yup a assumir uma característica específica
export const createValidation = validation((getSchema) => ({
    // Schema de validação
    body: getSchema<IBodyProps>(yup.object().shape({
        nome: yup.string().required().min(3).max(150),
    })),
}))

// Controller de criação de cidades
// Esse método só será executado, se os dados passarem na validação do middleware
// Tipando o tipo da request - informando que os dados, que o request irá receber, serão os que estão na interface ICidade
export const create = async (req: Request<{}, {}, IBodyProps>, res: Response) => {
    // Tentativa de criar uma cidade
    // Retorna se a criação da cidade foi bem sucedida, ou não, dentro do result
    const result = await CidadesProvider.create(req.body)

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
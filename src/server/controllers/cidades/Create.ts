import { Request, Response } from "express";
// Biblioteca para fazer validação de dados
import * as yup from 'yup'
import { validation } from "../../shared/middlewares";
import { StatusCodes } from "http-status-codes";

interface ICidade {
    nome: string;
}

// Middleware de validação
// 1° parâmetro: tipo da validação
// 2° parâmetro: schema da validação
// Método de validation que consegue forçar o yup a assumir uma característica específica
export const createValidation = validation((getSchema) => ({
    // Schema de validação
    body: getSchema<ICidade>(yup.object().shape({
        nome: yup.string().required().min(3),
    })),
}))

// Controller de criação de cidades
// Esse método só será executado, se os dados passarem na validação do middleware
// Tipando o tipo da request - informando que os dados, que o request irá receber, serão os que estão na interface ICidade
export const create = async (req: Request<{}, {}, ICidade>, res: Response) => {
    // Corpo da chamada
    const data = req.body

    console.log(data)
    
    return res.status(StatusCodes.CREATED).json(1)
}
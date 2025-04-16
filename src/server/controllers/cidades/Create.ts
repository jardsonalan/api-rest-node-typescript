import { Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
// Biblioteca para fazer validação de dados
import * as yup from 'yup'

interface ICidade {
    nome: string;
    estado: string;
}

// Schema de validação
const bodyValidation: yup.ObjectSchema<ICidade> = yup.object().shape({
    nome: yup.string().required().min(3),
    estado: yup.string().required().min(3),
})

// Middleware
export const createBodyValidator: RequestHandler = async (req, res, next) => {
    // Validação dos dados que vem no body do controller (create)
    try {
        // abortEarly - válida todos os erros, antes de retornar algum erro
        await bodyValidation.validate(req.body, { abortEarly: false })   
        // Caso a validação for realizada com sucesso, retorna para executar a próxima função
        return next()
    } catch (err) {
        const yupError = err as yup.ValidationError
        
        // Record - um objeto que tem que ser composto por uma chave do tipo string e um valor do tipo string
        const errors: Record<string, string> = {}

        yupError.inner.forEach((error) => {
            // path - caminho de onde aconteceu o error
            // message - mensagem de error
            
            // Verifica se o path é diferente de undefined
            if (!error.path) return

            errors[error.path] = error.message
        })

        // Retorna os erros específicos da aplicação
        return res.status(StatusCodes.BAD_REQUEST).json({ errors })
    }
}

// Controller de criação de cidades
// Esse método só será executado, se os dados passarem na validação do middleware
// Tipando o tipo da request - informando que os dados, que o request irá receber, serão os que estão na interface ICidade
export const create = async (req: Request<{}, {}, ICidade>, res: Response) => {
    // Corpo da chamada
    const data = req.body

    console.log(data)
    
    return res.send('Create')
}
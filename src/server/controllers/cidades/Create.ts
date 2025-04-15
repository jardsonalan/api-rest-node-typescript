import { Request, Response } from "express";
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

// Controller de criação de cidades
// Tipando o tipo da request - informando que os dados, que o request irá receber, serão os que estão na interface ICidade
export const create = async (req: Request<{}, {}, ICidade>, res: Response) => {
    // Dados que estamos recebendo da chamada
    const data = req.body

    // Serve para receber os dados
    let validateData: ICidade | undefined = undefined

    try {
        validateData = await bodyValidation.validate(data, { abortEarly: false })
        
    } catch (err) {
        const yupError = err as yup.ValidationError
        
        // Record - um objeto que tem que ser composto por uma chave do tipo string e um valor do tipo string
        const errors: Record<string, string> = {}

        yupError.inner.forEach((error) => {
            // path - caminho de onde aconteceu o error
            // message - mensagem de error
            
            // Verifica se não existe o path
            if (!error.path) return

            errors[error.path] = error.message
        })

        return res.status(StatusCodes.BAD_REQUEST).json({
            errors,
        })
    }

    console.log(validateData)

    return res.send('Create')
}
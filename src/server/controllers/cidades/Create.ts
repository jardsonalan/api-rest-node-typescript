import { Request, Response } from "express";
// Biblioteca para fazer validação de dados
import * as yup from 'yup'

interface ICidade {
    name: string;
}

// Schema de validação
const bodyValidation: yup.ObjectSchema<ICidade> = yup.object().shape({
    name: yup.string().required().min(3),
})

// Controller de criação de cidades
// Tipando o tipo da request - informando que os dados, que o request irá receber, serão os que estão na interface ICidade
export const create = async (req: Request<{}, {}, ICidade>, res: Response) => {
    // Dados que estamos recebendo da chamada
    const data = req.body

    // Serve para receber os dados
    let validateData: ICidade | undefined = undefined

    try {
        validateData = await bodyValidation.validate(data)
    } catch (error) {
        const yupError = error as yup.ValidationError
        
        return res.json({
            errors: {
                default: yupError.message // Retorna uma mensagem de erro
            }
        })
    }

    console.log(validateData)

    return res.send('Create')
}
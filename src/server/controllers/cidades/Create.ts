import { Request, Response } from "express";

interface ICidade {
    name: string
}

// Controller de criação de cidades
// Tipando o tipo da request - informando que os dados, que o request irá receber, serão os que estão na interface ICidade
export const create = (req: Request<{}, {}, ICidade>, res: Response) => {
    // Dados que estamos recebendo da chamada
    const data: ICidade = req.body
    console.log(data.name)

    return res.send('Create')
}
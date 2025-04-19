import { Request, Response } from "express";
import * as yup from 'yup'
import { validation } from "../../shared/middlewares";
import { StatusCodes } from "http-status-codes";

// Todos os parâmetros que vamos receber nos querys paramets
interface IQueryProps {
    page?: number;
    limit?: number;
    filter?: string;
}

export const getAllValidation = validation((getSchema) => ({
    query: getSchema<IQueryProps>(yup.object().shape({
        page: yup.number().moreThan(0),
        limit: yup.number().moreThan(0),
        filter: yup.string(),
    })),
}))

export const getAll = async (req: Request<{}, {}, {}, IQueryProps>, res: Response) => {
    // Serve para liberar o x-total-count para ser acessado pelo front-end
    res.setHeader('access-control-expose-headers', 'x-total-count')
    // Seta um valor no header
    res.setHeader('x-total-count', 1)
    
    return res.status(StatusCodes.OK).json([{
        id: 1,
        nome: 'Currais Novos',
    }])
}
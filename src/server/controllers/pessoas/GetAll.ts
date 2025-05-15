import { Request, Response } from "express";
import * as yup from 'yup'
import { validation } from "../../shared/middlewares";
import { StatusCodes } from "http-status-codes";
import { PessoasProvider } from "../../database/providers/pessoas";

// Todos os parâmetros que vamos receber nos querys paramets
interface IQueryProps {
  page?: number;
  limit?: number;
  filter?: string;
}

export const getAllValidation = validation((getSchema) => ({
  query: getSchema<IQueryProps>(yup.object().shape({
    page: yup.number().moreThan(0).default(1),
    limit: yup.number().moreThan(0).default(7),
    filter: yup.string().default(''),
  })),
}))

export const getAll = async (req: Request<{}, {}, {}, IQueryProps>, res: Response) => {
  const result = await PessoasProvider.getAll(req.query.page || 1, req.query.limit || 7, req.query.filter || '')
  const count = await PessoasProvider.count(req.query.filter)

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message
      }
    })
  } else if (count instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: count.message
      }
    })
  }

  // Serve para liberar o x-total-count para ser acessado pelo front-end
  res.setHeader('access-control-expose-headers', 'x-total-count')
  // Seta um valor no header
  res.setHeader('x-total-count', count)
  
  return res.status(StatusCodes.OK).json(result)
}
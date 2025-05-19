import { Request, Response } from "express";
import * as yup from 'yup'
import { validation } from "../../shared/middlewares";
import { StatusCodes } from "http-status-codes";
import { CidadesProvider } from "../../database/providers/cidades";

// Todos os parâmetros que vamos receber nos querys paramets
interface IQueryProps {
  id?: number;
  page?: number;
  limit?: number;
  filter?: string;
}

export const getAllValidation = validation((getSchema) => ({
  query: getSchema<IQueryProps>(yup.object().shape({
    id: yup.number().integer().default(0),
    page: yup.number().moreThan(0),
    limit: yup.number().moreThan(0),
    filter: yup.string(),
  })),
}))

export const getAll = async (req: Request<{}, {}, {}, IQueryProps>, res: Response) => {
  const result = await CidadesProvider.getAll(req.query.page || 1, req.query.limit || 7, req.query.filter || '', Number(req.query.id) || 0)
  const count = await CidadesProvider.count(req.query.filter)

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
import { Request, Response } from "express";
import * as yup from 'yup'
import { validation } from "../../shared/middlewares";
import { StatusCodes } from "http-status-codes";
import { IPessoa } from "../../database/models";
import { PessoasProvider } from "../../database/providers/pessoas";

interface IParamProps {
  id?: number;
}

interface IBodyProps extends Omit<IPessoa, 'id'>{}

export const updateByIdValidation = validation((getSchema) => ({
  body: getSchema<IBodyProps>(yup.object().shape({
    nome: yup.string().required().min(3),
    sobrenome: yup.string().required().min(3),
    email: yup.string().required().email(),
    cidadeId: yup.number().integer().required().min(1),
  })),
  params: getSchema<IParamProps>(yup.object().shape({
      id: yup.number().integer().required().moreThan(0),
  })),
}))

export const updateById = async (req: Request<IParamProps, {}, IBodyProps>, res: Response) => {
  if (!req.params.id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      errors: {
        default: 'O parâmetro "id" precisa ser informado'
      }
    })
  }
  
  const result = await PessoasProvider.updateById(req.params.id, req.body)

  if (result instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: result.message
      }
    })
  }
  
  return res.status(StatusCodes.NO_CONTENT).send()
}
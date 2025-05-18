import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { JWTService } from "../services";

// Serve para validar se o usuário está autenticado
// RequestHandler: define as tipagens da nossa função
export const ensureAuthenticated: RequestHandler = async (req, res, next) => {
  // Extrai uma autorização dos headers
  const { authorization } = req.headers

  // Verifica se o headers retorna um authorization
  if (!authorization) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: {
        default: "Não autenticado"
      }
    })
  }

  // Armazena o tipo do token e o conteúdo do token
  const [ type, token ] = authorization.split(' ')

  // Verifica se o token é do tipo: Bearer
  if (type !== 'Bearer') {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: {
        default: "Não autenticado"
      }
    })
  } 
  
  const jwtData = JWTService.verify(token)

  if (jwtData === 'JWT_SECRET_NOT_FOUND') {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        default: "Erro ao verificar token"
      }
    })
  } else if (jwtData === 'INVALID_TOKEN') {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errors: {
        default: "Não autenticado"
      }
    })
  }

  req.headers.idUsuario = jwtData.uid.toString()

  return next()
}
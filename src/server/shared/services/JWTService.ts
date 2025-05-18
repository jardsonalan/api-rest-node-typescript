// JWT: Não é criptografado
import * as jwt from 'jsonwebtoken'

interface IJwtData {
  uid: number
}

// Gera um token com duração de 24 horas
const sign = (data: IJwtData): string | 'JWT_SECRET_NOT_FOUND' => {
  // Verifica se o JWT existe
  if (!process.env.JWT_SECRET) return 'JWT_SECRET_NOT_FOUND'

  return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '24h' })
}

// Verifica se o token é válido
const verify = (token: string): IJwtData | 'JWT_SECRET_NOT_FOUND' | 'INVALID_TOKEN' => {
  if (!process.env.JWT_SECRET) return 'JWT_SECRET_NOT_FOUND'

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    if (typeof decoded === 'string') {
      return 'INVALID_TOKEN'
    }

    return decoded as IJwtData
  } catch (error) {
    return 'INVALID_TOKEN'
  }

}

export const JWTService = {
  sign,
  verify,
}
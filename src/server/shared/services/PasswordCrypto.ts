import { compare, genSalt, hash } from "bcryptjs"

// Tamanho dos caracteres aleatórios
const SALT_RANDOMS = 8

// Serve para criptografar a senha
const hashPassword = async (password: string) => {
  // Gera os caracteres aleatórios
  const saltGenerated = await genSalt(SALT_RANDOMS)

  // 1° paramêtro: senha que será criptografada
  // 2° paramêtro: caracteres aleatórios que deixaram a senha mais forte
  return await hash(password, saltGenerated)
  
}

// Serve para verificar se a senha está correta
const verifyPassword = async (password: string, hashedPassword: string) => {
  // Compara a senha informada pelo usuário, com a senha criptografada
  return await compare(password, hashedPassword)
}

export const PasswordCrypto = {
  hashPassword,
  verifyPassword,
}
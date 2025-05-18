import { StatusCodes } from "http-status-codes"
import { testServer } from "../jest.setup"

// describe - serve para auxiliar durante os testes
// 1º Parâmetro - serve para descrever qual o cenário que estamos testando
describe('Cidades - Create', () => {
  // Variável que armazena o accessToken
  let accessToken: string
  
  beforeAll(async () => {
    const email = 'create-cidade@email.com'
    const senha = '123456'
    // Serve para fazer o cadastro de um usuário
    await testServer
      .post('/cadastrar')
      .send({ nome: 'Teste', email, senha })
    // Serve para fazer o login com o usuário criado
    const SignInRes = await testServer
      .post('/entrar')
      .send({ email, senha })
    
    accessToken = SignInRes.body.accessToken
  })

  it('Tenta criar um registro sem o token de acesso', async () => {
    const resCreate = await testServer
      .post('/cidades/')
      .send({ nome: 'Currais Novos' })

    expect(resCreate.statusCode).toEqual(StatusCodes.UNAUTHORIZED)
    expect(resCreate.body).toHaveProperty('errors.default')
  })

  // it - caso de teste, um cenário
  // 1º Parâmetro - serve para descrever o que o teste irá fazer
  it('Cria registro', async () => {
    const resCreate = await testServer
      .post('/cidades/')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: 'Currais Novos' })

    // Serve para verificar se o nosso teste irá passar, ou não, na requisição
    // expect - informamos o que recebemos da resposta
    // toEqual - informamos o que esperavamos do retorno
    expect(resCreate.statusCode).toEqual(StatusCodes.CREATED)
    expect(typeof resCreate.body).toEqual('number')
  })

  it('Não pode criar um registro com o nome muito curto', async () => {
    const resCreate = await testServer
      .post('/cidades/')
      .set({ authorization: `Bearer ${accessToken}` })
      .send({ nome: 'Ca' })

    // Serve para verificar se o nosso teste irá passar, ou não, na requisição
    // expect - informamos o que recebemos da resposta
    // toHaveProperty - verifica se existe uma propriedade específica na resposta
    expect(resCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(resCreate.body).toHaveProperty('errors.body.nome')
  })
})
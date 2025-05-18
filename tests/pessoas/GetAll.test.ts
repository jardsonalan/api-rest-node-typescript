import { StatusCodes } from "http-status-codes"
import { testServer } from "../jest.setup"

describe('Pessoas - GetAll', () => {
  let accessToken: string
  
  beforeAll(async () => {
    const email = 'getall-pessoas@email.com'
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

  let cidadeId: number | undefined = undefined
  // Serve para criar uma cidade
  beforeAll(async () => {
    const resCidade = await testServer
      .post('/cidades/')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: 'Currais Novos' })

      cidadeId = resCidade.body
  })

  it('Tenta buscar todos os registros sem o token de acesso', async () => {
    const resGetAll = await testServer
      .get('/pessoas/')
      .send()

    expect(resGetAll.statusCode).toEqual(StatusCodes.UNAUTHORIZED)
    expect(resGetAll.body).toHaveProperty('errors.default')
  })

  it('Busca todos os registros', async () => {
    const resCreate = await testServer
      .post('/pessoas/')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: 'Jardson',
        sobrenome: 'Alan',
        email: 'jardson@email.com',
        cidadeId,
      })

    expect(resCreate.statusCode).toEqual(StatusCodes.CREATED)
    
    const resGetAll = await testServer
      .get('/pessoas/')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send()

    // x-total-count: informa o total de registros no banco de dados
    // body.length: informa o total de registros na página
    // toBeGreaterThan: verifica se o total de registros no banco de dados é maior que 0
    expect(Number(resGetAll.header['x-total-count'])).toBeGreaterThan(0)
    expect(resGetAll.statusCode).toEqual(StatusCodes.OK)
    expect(resGetAll.body.length).toBeGreaterThan(0)
  })
})
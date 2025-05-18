import { StatusCodes } from "http-status-codes"
import { testServer } from "../jest.setup"

describe('Cidades - GetAll', () => {
  let accessToken: string
  
  beforeAll(async () => {
    const email = 'getall-cidade@email.com'
    const senha = '123456'

    await testServer
      .post('/cadastrar')
      .send({ nome: 'Teste', email, senha })
    
    const SignInRes = await testServer
      .post('/entrar')
      .send({ email, senha })
    
    accessToken = SignInRes.body.accessToken
  })

  it('Tenta buscar todos os registros sem o token de acesso', async () => {
    const resGetAll = await testServer
      .get('/cidades/')
      .send()

    expect(resGetAll.statusCode).toEqual(StatusCodes.UNAUTHORIZED)
    expect(resGetAll.body).toHaveProperty('errors.default')
  })

  it('Busca todos os registros', async () => {
    const resCreate = await testServer
      .post('/cidades/')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: 'Currais Novos' })

    expect(resCreate.statusCode).toEqual(StatusCodes.CREATED)
    
    const resGetAll = await testServer
      .get('/cidades/')
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
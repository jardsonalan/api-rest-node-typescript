import { StatusCodes } from "http-status-codes"
import { testServer } from "../jest.setup"

describe('Cidades - GetById', () => {
  let accessToken: string
  
  beforeAll(async () => {
    const email = 'getbyid-cidade@email.com'
    const senha = '123456'

    await testServer
      .post('/cadastrar')
      .send({ nome: 'Teste', email, senha })
    
    const SignInRes = await testServer
      .post('/entrar')
      .send({ email, senha })
    
    accessToken = SignInRes.body.accessToken
  })

  it('Tenta buscar um registro através do ID sem o token de acesso', async () => {
    const resGetById = await testServer
      .get(`/cidades/1`)
      .send()

    expect(resGetById.statusCode).toEqual(StatusCodes.UNAUTHORIZED)
    expect(resGetById.body).toHaveProperty('errors.default')
  })

  it('Busca um registro através do ID', async () => {
    const resCreate = await testServer
      .post('/cidades/')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: 'Currais Novos' })

    expect(resCreate.statusCode).toEqual(StatusCodes.CREATED)
    
    const resGetById = await testServer
      .get(`/cidades/${resCreate.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send()

    // toHaveProperty: verifica se uma propriedade específica existe na resposta
    expect(resGetById.statusCode).toEqual(StatusCodes.OK)
    expect(resGetById.body).toHaveProperty('nome')
  })

  it('Tenta buscar um registro que não existe', async () => {
    const resGetById = await testServer
      .get('/cidades/99999')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send()

    expect(resGetById.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(resGetById.body).toHaveProperty('errors.default')
  })
})
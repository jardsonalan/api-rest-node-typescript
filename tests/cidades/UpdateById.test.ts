import { StatusCodes } from "http-status-codes"
import { testServer } from "../jest.setup"

describe('Cidades - UpdateById', () => {
  let accessToken: string
  
  beforeAll(async () => {
    const email = 'updatebyid-cidade@email.com'
    const senha = '123456'

    await testServer
      .post('/cadastrar')
      .send({ nome: 'Teste', email, senha })
    
    const SignInRes = await testServer
      .post('/entrar')
      .send({ email, senha })
    
    accessToken = SignInRes.body.accessToken
  })

  it('Tenta atualizar um registro sem o token de acesso', async () => {
    const resUpdateById = await testServer
      .put(`/cidades/1`)
      .send({ nome: 'Natal' })

    expect(resUpdateById.statusCode).toEqual(StatusCodes.UNAUTHORIZED)
    expect(resUpdateById.body).toHaveProperty('errors.default')
  })

  it('Atualiza um registro', async () => {
    const resCreate = await testServer
      .post('/cidades/')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: 'Currais Novos' })

    expect(resCreate.statusCode).toEqual(StatusCodes.CREATED)
    
    const resUpdateById = await testServer
      .put(`/cidades/${resCreate.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: 'Natal' })

    expect(resUpdateById.statusCode).toEqual(StatusCodes.NO_CONTENT)
  })

  it('Tenta atualizar um registro que não existe', async () => {
    const resUpdateById = await testServer
      .put('/cidades/99999')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: 'Natal' })

    expect(resUpdateById.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(resUpdateById.body).toHaveProperty('errors.default')
  })
})
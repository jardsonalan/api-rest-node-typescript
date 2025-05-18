import { StatusCodes } from "http-status-codes"
import { testServer } from "../jest.setup"

describe('Cidades - DeleteById', () => {
  let accessToken: string
  
  beforeAll(async () => {
    const email = 'delete-cidade@email.com'
    const senha = '123456'

    await testServer
      .post('/cadastrar')
      .send({ nome: 'Teste', email, senha })
    
    const SignInRes = await testServer
      .post('/entrar')
      .send({ email, senha })
    
    accessToken = SignInRes.body.accessToken
  })

  it('Tenta deletar um registro sem o token de acesso', async () => {
    const resDelete = await testServer
      .delete(`/cidades/1`)
      .send()

    expect(resDelete.statusCode).toEqual(StatusCodes.UNAUTHORIZED)
    expect(resDelete.body).toHaveProperty('errors.default')
  })

  it('Deleta registro', async () => {
    const resCreate = await testServer
      .post('/cidades/')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: 'Currais Novos' })

    expect(resCreate.statusCode).toEqual(StatusCodes.CREATED)
    
    const resDelete = await testServer
      .delete(`/cidades/${resCreate.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send()

    expect(resDelete.statusCode).toEqual(StatusCodes.NO_CONTENT)
  })

  it('Tenta deletar um registro que não existe', async () => {
    const resDelete = await testServer
      .delete('/cidades/99999')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send()

    expect(resDelete.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(resDelete.body).toHaveProperty('errors.default')
  })
})
import { StatusCodes } from "http-status-codes"
import { testServer } from "../jest.setup"

describe('Pessoas - DeleteById', () => {
  let accessToken: string
  
  beforeAll(async () => {
    const email = 'delete-pessoas@email.com'
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
  beforeAll(async () => {
    let resCidade = await testServer
      .post('/cidades/')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({ nome: 'Currais Novos' })

    cidadeId = resCidade.body
  })

  it('Tenta deletar registro sem o token de acesso', async () => {
    const resDelete = await testServer
      .delete(`/pessoas/1`)
      .send()

    expect(resDelete.statusCode).toEqual(StatusCodes.UNAUTHORIZED)
    expect(resDelete.body).toHaveProperty('errors.default')
  })

  it('Deleta registro', async () => {
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
    
    const resDelete = await testServer
      .delete(`/pessoas/${resCreate.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send()

    expect(resDelete.statusCode).toEqual(StatusCodes.NO_CONTENT)
  })

  it('Tenta deletar um registro que não existe', async () => {
    const resDelete = await testServer
      .delete('/pessoas/99999')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send()

    expect(resDelete.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(resDelete.body).toHaveProperty('errors.default')
  })
})
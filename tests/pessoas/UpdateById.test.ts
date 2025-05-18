import { StatusCodes } from "http-status-codes"
import { testServer } from "../jest.setup"

describe('Pessoas - UpdateById', () => {
  let accessToken: string
  
  beforeAll(async () => {
    const email = 'updatebyid-pessoas@email.com'
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

  it('Tenta atualizar um registro sem o token de acesso', async () => {
    const resUpdateById = await testServer
      .put(`/pessoas/1`)
      .send({
        nome: 'Jardson Alan',
        sobrenome: 'Vieira da Silva',
        email: 'jardsonalan@email.com',
        cidadeId,
      })

    expect(resUpdateById.statusCode).toEqual(StatusCodes.UNAUTHORIZED)
    expect(resUpdateById.body).toHaveProperty('errors.default')
  })

  it('Atualiza um registro', async () => {
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
    
    const resUpdateById = await testServer
      .put(`/pessoas/${resCreate.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: 'Jardson Alan',
        sobrenome: 'Vieira da Silva',
        email: 'jardsonalan@email.com',
        cidadeId,
      })

    expect(resUpdateById.statusCode).toEqual(StatusCodes.NO_CONTENT)
  })

  it('Tenta atualizar um registro que não existe', async () => {
    const resUpdateById = await testServer
      .put('/pessoas/99999')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: 'Fulano',
        sobrenome: 'Cicrano',
        email: 'fulano@email.com',
        cidadeId,
      })

    expect(resUpdateById.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(resUpdateById.body).toHaveProperty('errors.default')
  })
})
import { StatusCodes } from "http-status-codes"
import { testServer } from "../jest.setup"

describe('Pessoas - GetById', () => {
  let accessToken: string
  
  beforeAll(async () => {
    const email = 'getbyid-pessoas@email.com'
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
  
  it('Tenta buscar um registro através do ID sem o token de acesso', async () => {
    const resGetById = await testServer
      .get(`/pessoas/1`)
      .send()

    // toHaveProperty: verifica se uma propriedade específica existe na resposta
    expect(resGetById.statusCode).toEqual(StatusCodes.UNAUTHORIZED)
    expect(resGetById.body).toHaveProperty('errors.default')
  })

  it('Busca um registro através do ID', async () => {
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
    
    const resGetById = await testServer
      .get(`/pessoas/${resCreate.body}`)
      .set({ Authorization: `Bearer ${accessToken}` })
      .send()

    // toHaveProperty: verifica se uma propriedade específica existe na resposta
    expect(resGetById.statusCode).toEqual(StatusCodes.OK)
    expect(resGetById.body).toHaveProperty('nome')
  })

  it('Tenta buscar um registro que não existe', async () => {
    const resGetById = await testServer
      .get('/pessoas/99999')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send()

    expect(resGetById.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(resGetById.body).toHaveProperty('errors.default')
  })
})
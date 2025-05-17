import { StatusCodes } from "http-status-codes"
import { testServer } from "../jest.setup"

describe('Usuários - SignIn', () => {
  beforeAll(async () => {
    await testServer.post('/cadastrar/').send({
      nome: 'jardson',
      email: 'jardson@email.com',
      senha: '123456',
    })
  })

  it('Faz login', async () => {
    const resCreate = await testServer
      .post('/entrar/')
      .send({
        email: 'jardson@email.com',
        senha: '123456',
      })

    expect(resCreate.statusCode).toEqual(StatusCodes.OK)
    expect(resCreate.body).toHaveProperty('accessToken')
  })

  it('Senha errada', async () => {
    const resCreate = await testServer
      .post('/entrar/')
      .send({
        email: 'jardson@email.com',
        senha: '1234567',
      })

    expect(resCreate.statusCode).toEqual(StatusCodes.UNAUTHORIZED)
    expect(resCreate.body).toHaveProperty('errors.default')
  })

  it('Email errado', async () => {
    const resCreate = await testServer
      .post('/entrar/')
      .send({
        email: 'jardsonnn@email.com',
        senha: '123456',
      })

    expect(resCreate.statusCode).toEqual(StatusCodes.UNAUTHORIZED)
    expect(resCreate.body).toHaveProperty('errors.default')
  })

  it('Formato de email inválido', async () => {
    const resCreate = await testServer
      .post('/entrar/')
      .send({
        email: 'jardson email.com',
        senha: '123456',
      })

    expect(resCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(resCreate.body).toHaveProperty('errors.body.email')
  })

  it('Senha muito curta', async () => {
    const resCreate = await testServer
      .post('/entrar/')
      .send({
        email: 'jardson@email.com',
        senha: '12',
      })

    expect(resCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(resCreate.body).toHaveProperty('errors.body.senha')
  })

  it('Não informando a senha', async () => {
    const resCreate = await testServer
      .post('/entrar/')
      .send({
        email: 'jardson@email.com',
      })

    expect(resCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(resCreate.body).toHaveProperty('errors.body.senha')
  })

  it('Não informando o email', async () => {
    const resCreate = await testServer
      .post('/entrar/')
      .send({
        senha: '123456'
      })

    expect(resCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(resCreate.body).toHaveProperty('errors.body.email')
  })

  it('Não informando nada', async () => {
    const resCreate = await testServer
      .post('/entrar/')
      .send({})

    expect(resCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(resCreate.body).toHaveProperty('errors.body.email')
    expect(resCreate.body).toHaveProperty('errors.body.senha')
  })
})
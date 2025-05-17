import { StatusCodes } from "http-status-codes"
import { testServer } from "../jest.setup"

describe('Usuários - SignUp', () => {
  it('Cadastra usuário', async () => {
    const resCreate = await testServer
      .post('/cadastrar/')
      .send({
        nome: 'jardson',
        email: 'jardson@email.com',
        senha: '123456',
      })

    expect(resCreate.statusCode).toEqual(StatusCodes.CREATED)
    expect(typeof resCreate.body).toEqual('number')
  })

  it('Cadastra usuário 2', async () => {
    const resCreate = await testServer
      .post('/cadastrar/')
      .send({
        nome: 'alan',
        email: 'alan@email.com',
        senha: '123456',
      })

    expect(resCreate.statusCode).toEqual(StatusCodes.CREATED)
    expect(typeof resCreate.body).toEqual('number')
  })

  it('Erro ao cadastrar um usuário com email duplicado', async () => {
    const resCreate = await testServer
      .post('/cadastrar/')
      .send({
        nome: 'alan',
        email: 'alanduplicado@email.com',
        senha: '123456',
      })

    expect(resCreate.statusCode).toEqual(StatusCodes.CREATED)
    expect(typeof resCreate.body).toEqual('number')

    const resCreate2 = await testServer
      .post('/cadastrar/')
      .send({
        nome: 'alan silva',
        email: 'alanduplicado@email.com',
        senha: '123456',
      })

    expect(resCreate2.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(resCreate2.body).toHaveProperty('errors.default')
  })

  it('Não pode criar um registro com o nome muito curto', async () => {
    const resCreate = await testServer
      .post('/cadastrar/')
      .send({
        nome: 'ja',
        email: 'jardson@email.com',
        senha: '123456',
      })

    expect(resCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(resCreate.body).toHaveProperty('errors.body.nome')
  })

  it('Não pode criar um registro sem o nome', async () => {
    const resCreate = await testServer
      .post('/cadastrar/')
      .send({
        email: 'jardson@email.com',
        senha: '123456',
      })

    expect(resCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(resCreate.body).toHaveProperty('errors.body.nome')
  })

  it('Não pode criar um registro com o email inválido', async () => {
    const resCreate = await testServer
      .post('/cadastrar/')
      .send({
        nome: 'jardson',
        email: 'jardson email.com',
        senha: '123456',
      })

    expect(resCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(resCreate.body).toHaveProperty('errors.body.email')
  })

  it('Não pode criar um registro sem o email', async () => {
    const resCreate = await testServer
      .post('/cadastrar/')
      .send({
        nome: 'jardson',
        senha: '123456',
      })

    expect(resCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(resCreate.body).toHaveProperty('errors.body.email')
  })

  it('Não pode criar um registro com a senha muito curta', async () => {
    const resCreate = await testServer
      .post('/cadastrar/')
      .send({
        nome: 'jardson',
        email: 'jardson@email.com',
        senha: '123',
      })

    expect(resCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(resCreate.body).toHaveProperty('errors.body.senha')
  })

  it('Não pode criar um registro sem a senha', async () => {
    const resCreate = await testServer
      .post('/cadastrar/')
      .send({
        nome: 'jardson',
        email: 'jardson@email.com',
      })

    expect(resCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(resCreate.body).toHaveProperty('errors.body.senha')
  })

  it('Não pode criar um registro sem passar nada', async () => {
    const resCreate = await testServer
      .post('/cadastrar/')
      .send({})

    expect(resCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(resCreate.body).toHaveProperty('errors.body.nome')
    expect(resCreate.body).toHaveProperty('errors.body.email')
    expect(resCreate.body).toHaveProperty('errors.body.senha')
  })
})
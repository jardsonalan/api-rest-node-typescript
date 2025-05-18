import { StatusCodes } from "http-status-codes"
import { testServer } from "../jest.setup"

// describe - serve para auxiliar durante os testes
// 1º Parâmetro - serve para descrever qual o cenário que estamos testando
describe('Pessoas - Create', () => {
  // Variável que armazena o accessToken
  let accessToken: string
  
  beforeAll(async () => {
    const email = 'create-pessoas@email.com'
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

  it('Tenta criar um registro sem o token de acesso', async () => {
    const resCreate = await testServer
      .post('/pessoas/')
      .send({
        nome: 'Jardson',
        sobrenome: 'Alan',
        email: 'jardson@email.com',
        cidadeId,
      })

    expect(resCreate.statusCode).toEqual(StatusCodes.UNAUTHORIZED)
    expect(resCreate.body).toHaveProperty('errors.default')
  })
  // it - caso de teste, um cenário
  // 1º Parâmetro - serve para descrever o que o teste irá fazer
  it('Cria registro', async () => {
    const resCreate = await testServer
      .post('/pessoas/')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: 'Jardson',
        sobrenome: 'Alan',
        email: 'jardson@email.com',
        cidadeId,
      })

    // Serve para verificar se o nosso teste irá passar, ou não, na requisição
    // expect - informamos o que recebemos da resposta
    // toEqual - informamos o que esperavamos do retorno
    expect(resCreate.statusCode).toEqual(StatusCodes.CREATED)
    expect(typeof resCreate.body).toEqual('number')
  })

  it('Cria registro 2', async () => {
    const resCreate = await testServer
      .post('/pessoas/')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: 'Jardson Alan',
        sobrenome: 'Vieira da Silva',
        email: 'jardsonalan@email.com',
        cidadeId,
      })

    expect(resCreate.statusCode).toEqual(StatusCodes.CREATED)
    expect(typeof resCreate.body).toEqual('number')
  })

  it('Tenta criar um registro com o email duplicado', async () => {
    const resCreate = await testServer
      .post('/pessoas/')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: 'Juca',
        sobrenome: 'Silva',
        email: 'jucasilva@email.com',
        cidadeId,
      })

    expect(resCreate.statusCode).toEqual(StatusCodes.CREATED)
    expect(typeof resCreate.body).toEqual('number')

    const resCreate2 = await testServer
      .post('/pessoas/')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: 'Juca',
        sobrenome: 'Duplicado',
        email: 'jucasilva@email.com',
        cidadeId,
      })

    expect(resCreate2.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(resCreate2.body).toHaveProperty('errors.default')
  })

  it('Tenta criar um registro com o nome muito curto', async () => {
    const resCreate = await testServer
      .post('/pessoas/')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: 'Ja',
        sobrenome: 'Alan',
        email: 'jardson@email.com',
        cidadeId,
      })

    expect(resCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(resCreate.body).toHaveProperty('errors.body.nome')
  })

  it('Tenta criar um registro com o sobrenome muito curto', async () => {
    const resCreate = await testServer
      .post('/pessoas/')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: 'Jardson',
        sobrenome: 'Al',
        email: 'jardson@email.com',
        cidadeId,
      })

    expect(resCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(resCreate.body).toHaveProperty('errors.body.sobrenome')
  })

  it('Tenta criar um registro sem o nome', async () => {
    const resCreate = await testServer
      .post('/pessoas/')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        sobrenome: 'Alan',
        email: 'jardson@email.com',
        cidadeId,
      })

    expect(resCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(resCreate.body).toHaveProperty('errors.body.nome')
  })

  it('Tenta criar um registro sem o sobrenome', async () => {
    const resCreate = await testServer
      .post('/pessoas/')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: 'Jardson',
        email: 'jardson@email.com',
        cidadeId,
      })

    expect(resCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(resCreate.body).toHaveProperty('errors.body.sobrenome')
  })

  it('Tenta criar um registro sem o email', async () => {
    const resCreate = await testServer
      .post('/pessoas/')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: 'Jardson',
        sobrenome: 'Alan',
        cidadeId,
      })

    expect(resCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(resCreate.body).toHaveProperty('errors.body.email')
  })

  it('Tenta criar um registro com o email inválido', async () => {
    const resCreate = await testServer
      .post('/pessoas/')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: 'Jardson',
        sobrenome: 'Alan',
        email: 'jardson email.com',
        cidadeId,
      })

    expect(resCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(resCreate.body).toHaveProperty('errors.body.email')
  })

  it('Tenta criar um registro sem o cidadeId', async () => {
    const resCreate = await testServer
      .post('/pessoas/')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: 'Jardson',
        sobrenome: 'Alan',
        email: 'jardson@email.com',
      })

    expect(resCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(resCreate.body).toHaveProperty('errors.body.cidadeId')
  })

  it('Tenta criar um registro com o cidadeId inválido', async () => {
    const resCreate = await testServer
      .post('/pessoas/')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: 'Jardson',
        sobrenome: 'Alan',
        email: 'jardson@email.com',
        cidadeId: 999999,
      })

    expect(resCreate.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(resCreate.body).toHaveProperty('errors.default')
  })

  it('Tenta criar um registro com o cidadeId em formato string', async () => {
    const resCreate = await testServer
      .post('/pessoas/')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({
        nome: 'Jardson',
        sobrenome: 'Alan',
        email: 'jardson@email.com',
        cidadeId: 'teste',
      })

    expect(resCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(resCreate.body).toHaveProperty('errors.body.cidadeId')
  })

  it('Tenta criar um registro sem enviar nenhuma propriedade', async () => {
    const resCreate = await testServer
      .post('/pessoas/')
      .set({ Authorization: `Bearer ${accessToken}` })
      .send({})

    expect(resCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(resCreate.body).toHaveProperty('errors.body.nome')
    expect(resCreate.body).toHaveProperty('errors.body.sobrenome')
    expect(resCreate.body).toHaveProperty('errors.body.email')
    expect(resCreate.body).toHaveProperty('errors.body.cidadeId')
  })
})
import { StatusCodes } from "http-status-codes"
import { testServer } from "../jest.setup"

describe('Pessoas - GetAll', () => {
  let cidadeId: number | undefined = undefined
  // Serve para criar uma cidade
  beforeAll(async () => {
    const resCidade = await testServer
      .post('/cidades/')
      .send({ nome: 'Currais Novos' })

      cidadeId = resCidade.body
  })

  it('Busca todos os registros', async () => {
    const resCreate = await testServer
      .post('/pessoas/')
      .send({
        nome: 'Jardson',
        sobrenome: 'Alan',
        email: 'jardson@email.com',
        cidadeId,
      })

    expect(resCreate.statusCode).toEqual(StatusCodes.CREATED)
    
    const resGetAll = await testServer
      .get('/pessoas/')
      .send()

    // x-total-count: informa o total de registros no banco de dados
    // body.length: informa o total de registros na página
    // toBeGreaterThan: verifica se o total de registros no banco de dados é maior que 0
    expect(Number(resGetAll.header['x-total-count'])).toBeGreaterThan(0)
    expect(resGetAll.statusCode).toEqual(StatusCodes.OK)
    expect(resGetAll.body.length).toBeGreaterThan(0)
  })
})
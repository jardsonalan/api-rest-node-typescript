import { StatusCodes } from "http-status-codes"
import { testServer } from "../jest.setup"

describe('Pessoas - UpdateById', () => {
  let cidadeId: number | undefined = undefined
  beforeAll(async () => {
    let resCidade = await testServer
      .post('/cidades/')
      .send({ nome: 'Currais Novos' })

      cidadeId = resCidade.body
  })

  it('Atualiza um registro', async () => {
    const resCreate = await testServer
      .post('/pessoas/')
      .send({
        nome: 'Jardson',
        sobrenome: 'Alan',
        email: 'jardson@email.com',
        cidadeId,
      })

    expect(resCreate.statusCode).toEqual(StatusCodes.CREATED)
    
    const resUpdateById = await testServer
      .put(`/pessoas/${resCreate.body}`)
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
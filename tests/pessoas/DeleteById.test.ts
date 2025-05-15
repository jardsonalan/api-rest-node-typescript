import { StatusCodes } from "http-status-codes"
import { testServer } from "../jest.setup"

describe('Pessoas - DeleteById', () => {
  let cidadeId: number | undefined = undefined
  beforeAll(async () => {
    let resCidade = await testServer
      .post('/cidades/')
      .send({ nome: 'Currais Novos' })

    cidadeId = resCidade.body
  })

  it('Deleta registro', async () => {
    const resCreate = await testServer
      .post('/pessoas/')
      .send({
        nome: 'Jardson',
        sobrenome: 'Alan',
        email: 'jardson@email.com',
        cidadeId,
      })

    expect(resCreate.statusCode).toEqual(StatusCodes.CREATED)
    
    const resDelete = await testServer
      .delete(`/pessoas/${resCreate.body}`)
      .send()

    expect(resDelete.statusCode).toEqual(StatusCodes.NO_CONTENT)
  })

  it('Tenta deletar um registro que não existe', async () => {
    const resDelete = await testServer
      .delete('/pessoas/99999')
      .send()

    expect(resDelete.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(resDelete.body).toHaveProperty('errors.default')
  })
})
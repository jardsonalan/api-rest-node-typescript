import { StatusCodes } from "http-status-codes"
import { testServer } from "../jest.setup"

describe('Cidades - DeleteById', () => {
    it('Deleta registro', async () => {
        const resCreate = await testServer
            .post('/cidades/')
            .send({ nome: 'Currais Novos' })

        expect(resCreate.statusCode).toEqual(StatusCodes.CREATED)
        
        const resDelete = await testServer
            .delete(`/cidades/${resCreate.body}`)
            .send()

        expect(resDelete.statusCode).toEqual(StatusCodes.NO_CONTENT)
    })

    it('Tenta deletar um registro que não existe', async () => {
        const resDelete = await testServer
            .delete('/cidades/99999')
            .send()

        expect(resDelete.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
        expect(resDelete.body).toHaveProperty('errors.default')
    })
})
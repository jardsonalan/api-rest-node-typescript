import { StatusCodes } from "http-status-codes"
import { testServer } from "../jest.setup"

describe('Cidades - UpdateById', () => {
    it('Atualiza um registro', async () => {
        const resCreate = await testServer
            .post('/cidades/')
            .send({ nome: 'Currais Novos' })

        expect(resCreate.statusCode).toEqual(StatusCodes.CREATED)
        
        const resUpdateById = await testServer
            .put(`/cidades/${resCreate.body}`)
            .send({ nome: 'Natal' })

        expect(resUpdateById.statusCode).toEqual(StatusCodes.NO_CONTENT)
    })

    it('Tenta atualizar um registro que não existe', async () => {
        const resUpdateById = await testServer
            .put('/cidades/99999')
            .send({ nome: 'Natal' })

        expect(resUpdateById.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
        expect(resUpdateById.body).toHaveProperty('errors.default')
    })
})
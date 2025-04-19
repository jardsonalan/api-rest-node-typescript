import { StatusCodes } from "http-status-codes"
import { testServer } from "../jest.setup"

describe('Cidades - GetById', () => {
    it('Busca um registro através do ID', async () => {
        const resCreate = await testServer
            .post('/cidades/')
            .send({ nome: 'Currais Novos' })

        expect(resCreate.statusCode).toEqual(StatusCodes.CREATED)
        
        const resGetById = await testServer
            .get(`/cidades/${resCreate.body}`)
            .send()

        // toHaveProperty: verifica se uma propriedade específica existe na resposta
        expect(resGetById.statusCode).toEqual(StatusCodes.OK)
        expect(resGetById.body).toHaveProperty('nome')
    })

    it('Tenta buscar um registro que não existe', async () => {
        const resGetById = await testServer
            .get('/cidades/99999')
            .send()

        expect(resGetById.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
        expect(resGetById.body).toHaveProperty('errors.default')
    })
})
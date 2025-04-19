import { StatusCodes } from "http-status-codes"
import { testServer } from "../jest.setup"

// describe - serve para auxiliar durante os testes
// 1º Parâmetro - serve para descrever qual o cenário que estamos testando
describe('Cidades - Create', () => {
    // it - caso de teste, um cenário
    // 1º Parâmetro - serve para descrever o que o teste irá fazer
    it('Cria registro', async () => {
        const resCreate = await testServer
            .post('/cidades/')
            .send({ nome: 'Currais Novos' })

        // Serve para verificar se o nosso teste irá passar, ou não, na requisição
        // expect - informamos o que recebemos da resposta
        // toEqual - informamos o que esperavamos do retorno
        expect(resCreate.statusCode).toEqual(StatusCodes.CREATED)
        expect(typeof resCreate.body).toEqual('number')
    })

    it('Não pode criar um registro com o nome muito curto', async () => {
        const resCreate = await testServer
            .post('/cidades/')
            .send({ nome: 'Ca' })

        // Serve para verificar se o nosso teste irá passar, ou não, na requisição
        // expect - informamos o que recebemos da resposta
        // toHaveProperty - verifica se existe uma propriedade específica na resposta
        expect(resCreate.statusCode).toEqual(StatusCodes.BAD_REQUEST)
        expect(resCreate.body).toHaveProperty('errors.body.nome')
    })
})
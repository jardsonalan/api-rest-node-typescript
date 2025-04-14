import express from 'express';

// Instância do servidor
const server = express()

// request - requisição que será feita ao servidor
// response - resposta que vamos entregar ao servidor
server.get('/', (request, response) => {
    return response.send('Olá, Dev!')
})

export { server }
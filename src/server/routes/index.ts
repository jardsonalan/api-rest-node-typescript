// Router - cria uma espécie de middleware para o nosso servidor
// Podemos especificar todas as nossas rotas
import { Router } from "express";

// Biblioteca que fornece os status code com mais detalhes
import { StatusCodes } from 'http-status-codes'

const router = Router()

// request - requisição que será feita ao servidor
// response - resposta que vamos entregar ao servidor
router.get('/', (request, response) => {
    return response.send('Olá, Dev!')
})

router.post('/teste', (request, response) => {
    console.log(request.body)

    // json() - faz com que o express trate alguns headers e algumas configurações na nossa resposta para o front-end
    return response.status(StatusCodes.UNAUTHORIZED).json(request.body) // Enviando o body de volta
})

export { router }
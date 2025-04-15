// Router - cria uma espécie de middleware para o nosso servidor
// Podemos especificar todas as nossas rotas
import { Router } from "express";
// Biblioteca que fornece os status code com mais detalhes
import { StatusCodes } from 'http-status-codes'
import { CidadesController } from "../controllers";

const router = Router()

// request - requisição que será feita ao servidor
// response - resposta que vamos entregar ao servidor
router.get('/', (request, response) => {
    return response.send('Funcionando')
})

router.post('/cidades', CidadesController.create)

export { router }
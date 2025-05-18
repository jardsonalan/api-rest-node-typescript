// Router - cria uma espécie de middleware para o nosso servidor
// Podemos especificar todas as nossas rotas
import { Router } from "express";
// Biblioteca que fornece os status code com mais detalhes
import { CidadesController, PessoasController, UsuariosController } from "../controllers";
import { ensureAuthenticated } from "../shared/middlewares";

const router = Router()

// request - requisição que será feita ao servidor
// response - resposta que vamos entregar ao servidor
router.get('/', (request, response) => {
    return response.send('Funcionando')
})

// Rotas de cidades
router.get('/cidades', ensureAuthenticated, CidadesController.getAllValidation, CidadesController.getAll)
// Executa a validação dos dados, antes da criação dos dados
router.post('/cidades', ensureAuthenticated, CidadesController.createValidation, CidadesController.create)
router.get('/cidades/:id', ensureAuthenticated, CidadesController.getByIdValidation, CidadesController.getById)
router.put('/cidades/:id', ensureAuthenticated, CidadesController.updateByIdValidation, CidadesController.updateById)
router.delete('/cidades/:id', ensureAuthenticated, CidadesController.deleteByIdValidation, CidadesController.deleteById)

// Rotas de pessoas
router.get('/pessoas', ensureAuthenticated, PessoasController.getAllValidation, PessoasController.getAll)
router.post('/pessoas', ensureAuthenticated, PessoasController.createValidation, PessoasController.create)
router.get('/pessoas/:id', ensureAuthenticated, PessoasController.getByIdValidation, PessoasController.getById)
router.put('/pessoas/:id', ensureAuthenticated, PessoasController.updateByIdValidation, PessoasController.updateById)
router.delete('/pessoas/:id', ensureAuthenticated, PessoasController.deleteByIdValidation, PessoasController.deleteById)

// Rotas de usuários
router.post('/entrar', UsuariosController.signInValidation, UsuariosController.signIn)
router.post('/cadastrar', UsuariosController.signUpValidation, UsuariosController.signUp)

export { router }
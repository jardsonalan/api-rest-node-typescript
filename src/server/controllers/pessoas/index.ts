// index.ts - serve para agrupar todas as controllers em uma única variável

// Faz com que possamos utilizar todos os métodos exportados de um arquivo
import * as create from "./Create"
import * as getAll from './GetAll'
import * as getById from './GetById'
import * as updateById from './UpdateById'
import * as deleteById from './DeleteById'

// Simplifica o uso das Controllers no arquivo de rotas
export const PessoasController = {
    // Utiliza o spread para retornar todos os métodos exportados de um arquivo
    ...create,
    ...getAll,
    ...getById,
    ...updateById,
    ...deleteById,
}
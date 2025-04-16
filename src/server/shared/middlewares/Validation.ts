import { RequestHandler } from "express"
import { AnyObject, ObjectSchema, ValidationError } from "yup"
import { StatusCodes } from "http-status-codes"

type TProperty = 'body' | 'header' | 'params' | 'query'

// T - Tipagem genérica
// Tipagem que específica uma função que é capaz de retornar um único schema 
type TGetSchema = <T extends AnyObject>(schema: ObjectSchema<T>) => ObjectSchema<T>

type TAllSchemas = Record<TProperty, ObjectSchema<any>>

// Tem a capacidade de retornar todos os schemas de uma vez
type TGetAllSchemas = (getSchema: TGetSchema) => Partial<TAllSchemas>

// Indica que a função irá retornar um RequestHandler
// Partial - indica que nem todos os campos são obrigatórios
type TValidation = (getAllSchemas: TGetAllSchemas) => RequestHandler

// Função de validação que recebe o tipo de validação e o schema
// getAllSchemas - função que retorna todos os schemas
export const validation: TValidation = (getAllSchemas) => async (req, res, next) => {
    // Serve para retornar todos os schemas
    const schemas = getAllSchemas((schema) => schema)

    // string: armazena a key
    // Record<string, string>: armazena um objeto com todos os erros que aconteceram em uma determinada chave
    const errorsResult: Record<string, Record<string, string>> = {}
    
    // Percorre por todos os schemas
    // key: body | query | params | header
    // schema: validação de cada key
    Object.entries(schemas).forEach(([key, schema]) => {
        // Validação dos dados que vem no body do controller (create)
        try {
            // abortEarly - válida todos os erros, antes de retornar algum erro
            // validateSync - espera a validação acontecer e depois retorna um erro ou um resultado de sucesso
            // Válida os dados que recebemos na requisição com o schema correto
            schema.validateSync(req[key as TProperty], { abortEarly: false })   
        } catch (err) {
            const yupError = err as ValidationError
            
            // Record - um objeto que tem que ser composto por uma chave do tipo string e um valor do tipo string
            // Mapeia todos os erros que aconteceram
            const errors: Record<string, string> = {}

            // Realiza um forEach para cada erro que recebemos
            yupError.inner.forEach((error) => {
                // path - caminho de onde aconteceu o error
                // message - mensagem de error
                
                // Verifica se o path é diferente de undefined
                if (!error.path) return

                // Armazena o erro dentro do Record de errors
                errors[error.path] = error.message
            })

            // Armazena todos os erros, que foram gerados em uma chave, dentro da variável errorsResult
            errorsResult[key] = errors

            // Retorna os erros específicos da aplicação
            // return res.status(StatusCodes.BAD_REQUEST).json({ errors })
        }
    })

    if (Object.entries(errorsResult).length === 0) {
        // Caso a validação for realizada com sucesso, retorna para executar a próxima função
        return next()
    } else {
        // Retorna os erros específicos da aplicação
        return res.status(StatusCodes.BAD_REQUEST).json({ errors: errorsResult })
    }
}
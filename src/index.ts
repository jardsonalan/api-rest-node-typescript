import { Knex } from "./server/database/knex"
import { server } from "./server/Server"

// Serve para escutar o servidor
const startServer = () => {
  server.listen(process.env.PORT || 3000, () => {
      console.log(`Rodando na porta: ${process.env.PORT || 3000}`)
  })
}

// Verifica se o cenário que a aplicação está rodando, é no cenário de localhost
// Se for em produção, roda as migrations ao iniciar a aplicação
if (process.env.IS_LOCALHOST !== 'true') {
  // Serve para rodar as migrations ao iniciar a aplicação
  // Roda primeiro as migrations e depois inicializa o servidor
  Knex.migrate.latest()
    .then(() => {
      startServer()
    })
    .catch(console.log)
} else {
  startServer()
}
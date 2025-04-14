import { server } from "./server/Server"

// Serve para escutar o servidor
server.listen(process.env.PORT || 3000, () => {
    console.log(`Rodando na porta: ${process.env.PORT || 3000}`)
})
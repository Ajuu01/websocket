import app from "./src/app"
import { envConfig } from './src/config/config'
import ConnectToDb from "./src/config/db"
import { Server } from "socket.io"
import todo from "./src/todo/todoController"

let io: Server | undefined

function startServer() {
    ConnectToDb()

    const port = envConfig.port || 4000

    const server = app.listen(port, () => {
        console.log(`server has started at port [${port}]`)
    })

    // Initialize socket.io
    io = new Server(server)
    todo.init()
    
}

function getSocketIo() {
    if (!io) {
        throw new Error("SocketIO hasn't been initialized!!")
    }
    return io;
}
startServer()
export { getSocketIo }

import app from "./src/app"
import {envConfig} from './src/config/config'
import ConnectToDb from "./src/config/db"
import { Server } from 'socket.io'

async function startServer(){
    await ConnectToDb()
    const port=envConfig.port || 4000
    const server=app.listen(port,()=>{
        console.log(`server has started at port ${port}`)
    })
    const io=new Server(server)
    io.on("connection",(socket)=>{
        socket.on("haha",(data)=>{
            console.log(data)
            socket.emit("response",{
                message:"Hi"
            })
        })
        console.log("Someone one connected(Client")
    })
}

startServer()
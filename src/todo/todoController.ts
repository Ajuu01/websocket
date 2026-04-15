import { Socket } from "socket.io";
import { getSocketIo } from "../../server";
import todoModel from "./todoModel";


class Todo{
    init(){
        const io=getSocketIo();
        io.on("connection",(socket:Socket)=>{
            console.log("New client connected!!")
            socket.on("addTodo",(data)=>this.handleAddTodo(socket,data))
            socket.on("deleteTodo",(data)=>this.handleDeleteTodo(socket,data))
        })
    }

    private async handleAddTodo(socket:Socket,data:any){
        try{
            const {task,deadline,status}=data
            await todoModel.create({
                task,
                deadline,
                status
            })
            const todos=await todoModel.find()
            socket.emit("todos_updated",{
                status:"Success",
                data:todos
            })
        }catch(error){
            socket.emit("todo_error",{
                status:"error",
                error
            })
        }
    }

    private async handleDeleteTodo(socket:Socket,data:{id:String}){
        try{
            const {id}=data
            const deletedTodo=await todoModel.findByIdAndDelete(id)
            if(!deletedTodo){
                socket.emit("todos_response",{
                    status:"error",
                    message:"Todo not found"
                })
                return;
            }
            const todos=await todoModel.find()
            socket.emit("todos_updated",{
                status:"Success",
                todos
            })
        }catch(error){
            socket.emit("todos_error",{
                status:"Error",
                error
            })
        }
    }
}

export default new Todo()
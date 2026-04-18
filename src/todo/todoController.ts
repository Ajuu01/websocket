import { Socket } from "socket.io";
import { getSocketIo } from "../../server";
import todoModel from "./todoModel";
import { Status } from "./todoTypes";


class Todo{
    init(){
        const io=getSocketIo();
        io.on("connection",(socket:Socket)=>{
            console.log("New client connected!!")
            socket.on("addTodo",(data)=>this.handleAddTodo(socket,data))
            socket.on("deleteTodo",(data)=>this.handleDeleteTodo(socket,data))
            socket.on("updateTodoStatus",(data)=>this.handleUpdateTodoStatus(socket,data))
            socket.on("fetchTodo",(data)=>this.handleFetchTodo(socket))
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
            const todos=await todoModel.find({status:Status.Pending})
            socket.emit("todos_updated",{
                status:"success",
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
            const todos=await todoModel.find({status:Status.Pending})
            socket.emit("todos_updated",{
                status:"success",
                todos
            })
        }catch(error){
            socket.emit("todos_error",{
                status:"Error",
                error
            })
        }
    }

    private async handleUpdateTodoStatus(socket:Socket,data:{id:String,status:Status}){
        try{
            const {id,status}=data
            const todo=await todoModel.findByIdAndUpdate(id,{status},{new:true})
            if(!todo){
                socket.emit("todos_response",{
                    status:"error",
                    message:"Todo not found"
                })
                return;
            }
            const todos=await todoModel.find({status:Status.Pending})
            socket.emit("todos_updated",{
                status:"success",
                data:todos
            })
        }catch(error){
            socket.emit("todos_response",{
                status:"error",
                error
            })
        }

    }
    private async handleFetchTodo(socket:Socket){
        try{
            const todos=todoModel.find({status:Status.Pending})
            socket.emit("todos_updated",{
                status:"success",
                data:todos
            })
        }catch(error){
            socket.emit("todos_response",{
                status:"error",
                error
            })
        }
    }
}

export default new Todo()
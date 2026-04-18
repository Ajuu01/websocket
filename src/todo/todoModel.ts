import mongoose from "mongoose"
import { ITodo, Status } from "./todoTypes"

const Schema=mongoose.Schema

const todoSchema=new Schema<ITodo>({
    task:{
        type:String,
        required:true
    },
    deadline:String,
    status:{
        type:String,
        enum:[Status.Completed,Status.Pending],
        default:Status.Pending
    }
})

export default mongoose.model("Todo",todoSchema)
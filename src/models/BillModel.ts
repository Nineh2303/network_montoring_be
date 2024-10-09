import e from "cors";
import mongoose from "mongoose";
import { IBill } from "../types/Bill";


const BillSchema = new  mongoose.Schema({
    customerId: {type:String, require:true} ,  
    productId: {type:String, require:true},
    paymentDate: {type:Date, require:true}, 
    serviceDescription :{type:String, require:true},
    status :{type:String}, 
    amount : {type: Number}
}, {timestamps: true})

const Bill = mongoose.model<IBill>("Bill", BillSchema)
export default Bill
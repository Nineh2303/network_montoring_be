import mongoose from "mongoose";
import { IMonthAmount } from "../types/Bill";


const MonthAmountSchema = new mongoose.Schema({
    customerId : {type:String, require:true},
    month : {type:Number, require:true}, 
    year: {type:Number, require:true} , 
    totalAmount : {type:Number, require:true, default:0 }
})

const MonthAmount = mongoose.model<IMonthAmount>("MonthAmount", MonthAmountSchema)
export default MonthAmount
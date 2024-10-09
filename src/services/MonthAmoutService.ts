import {Request,Response} from "express"
import MonthAmount from './../models/MonthAmount';
import { ApiResponse } from "../types/ApiResponse";

export const MonthAmountService = {
    createBill: async(req:Request, res:Response)=>{

        const {customerId} =  req.body; 
        try {
            const allMonthAmountByCustomer = await MonthAmount.find({customerId:customerId}); 
            const apiResponse:ApiResponse ={
                error:false,
                msg: "Success",
                object: allMonthAmountByCustomer
            }
            return res.json(apiResponse)
        } catch(err){
            const apiResponse:ApiResponse ={
                error:true,
                msg: "Failed",
                object: null
            }
            return res.json(apiResponse)

        }
    }
}
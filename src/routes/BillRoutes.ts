
import express , {Request, Response} from 'express';
import { BillService } from '../services/BillService';


const billRoutes = express.Router();

billRoutes
.post("/create", async(req:Request,res:Response)=> BillService.createBill(req,res))
.post("/get-by-customer", async(req:Request,res:Response)=> BillService.getLatestBillByCustomerId(req,res))
.post("/all-bill-by-customer" , async(req:Request,res:Response)=>BillService.getAllBillByCustomer(req,res))
export default billRoutes

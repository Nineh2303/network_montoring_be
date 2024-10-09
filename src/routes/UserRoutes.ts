import express, { Request, Response, NextFunction } from "express";
import { UserServices } from "../services/UserServices";
import { authMiddleware } from "../middlewares/AuthMiddleware";

const userRoutes = express.Router();


userRoutes
.post("/register",async (req: Request, res: Response) => UserServices.registerUser(req, res))
.post("/login",async (req: Request, res: Response) => UserServices.login(req, res))
.post("/check-auth",
    (req:Request,res:Response, next:NextFunction)=> authMiddleware.checkAuthorization(req,res,next)
,(req:Request,res:Response) => UserServices.checkAuth(req,res))
.get("/all-user", (req:Request,res:Response) => UserServices.getAllUserRoleUser(req,res))
.post("/log-out", (req:Request, res:Response, next:NextFunction)=> authMiddleware.checkAuthorization (req,res,next)
,(req:Request,res:Response)=>UserServices.logOut(req,res))
export default userRoutes
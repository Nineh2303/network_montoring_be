import { Request, Response } from "express";
import { IUser, IUserRoleUser, RegisterUserRequest } from "../types/user";
import User from "../models/UserModel";
import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";
import { ApiResponse } from "../types/ApiResponse";
export const UserServices = {
  registerUser: async (req: Request, res: Response) => {
    const { fullname, username, password, role } = req.body;
    const existUser = await User.findOne({ userName: username });
    if (existUser) {
      return res
        .status(200)
        .json({ error: true, msg: "Tài khoản đã tồn tại !" });
    }
    const newUser = new User({
      fullName: fullname,
      userName: username,
      password: password,
      role: role,
    });

    await newUser.save();

    const token = jwt.sign(
      { username: username, role: role },
      process.env.JWT_REFRESH_KEY as string,
      {
        expiresIn: "1d",
      }
    );
    const refreshToken = jwt.sign(
      { username: username, role: role },
      process.env.JWT_REFRESH_KEY as string,
      { expiresIn: "1d" }
    );
    const apiResponse: ApiResponse = {
      error: false,
      msg: "Success",
      object: {
        fullname: fullname,
        username: username,
        role: role,
      },
    };
    return res
      .cookie("refresh_token", refreshToken, {
        secure: true,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      })

      .status(200)
      .json(apiResponse);
  },
  login: async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ userName: username });
      if (!user) {
        return res.status(200).json({
          msg: "Tài khoản hoặc mật khẩu không chính xác, vui lòng thử lại !!",
        });
      }
      const isMatchPassword = await bcrypt.compare(password, user.password);
      if (!isMatchPassword) {
        return res.status(200).json({
          msg: "Tài khoản hoặc mật khẩu không chính xác, vui lòng thử lại !!",
        });
      }
      const userRes = {
        _id:user._id,
        fullname: user.fullName,
        username: user.userName,
        role: user.role,
      }
      const token = jwt.sign(
        { username: user.userName, role: user.role },
        process.env.JWT_SECRET_KEY as string,
        {
          expiresIn: "1d",
        }
      );
      const apiResponse: ApiResponse = {
        error: false,
        msg: "Success",
        object: {
         user: userRes,
         token: token
        },
      };
      return res.status(200).json(apiResponse);
    } catch (e) {
      return res.status(400);
    }
  },
  checkAuth : async (req:Request, res:Response) =>{
    const {hashData} = req.body;
    if(hashData.username){
      const user= await User.findOne({userName :hashData.username})
      const responseEntity: ApiResponse = {
        error: false,
        msg: "Authorized !!",
        object: {user:user},
      };
       return res.status(200).json(responseEntity)
    }
  },
  getAllUserRoleUser: async(req:Request,res:Response) =>{
    const allUserRole =  await User.find({role:"USER"}).select("-password")
    const users:IUserRoleUser[] = []
    allUserRole.forEach((e:IUser)=>{
      const user :IUserRoleUser ={
          _id: e._id as string,
          fullName: e.fullName,
      }
      users.push(user)
    })
    const responseEntity: ApiResponse = {
      error: false,
      msg: "Fetch Success",
      object:users,
    };
     return res.status(200).json(responseEntity)
  },
  logOut : async(req:Request, res:Response) =>{
    const responseEntity: ApiResponse = {
      error: false,
      msg: "Logout Success",
      object:{},
    };
    return res.clearCookie("refresh_token").status(200).json(responseEntity)
  }
};

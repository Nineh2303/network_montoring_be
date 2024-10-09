import { AES, enc } from "crypto-ts";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
export const authMiddleware = {
  checkAuthorization: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(403).json("Invalid token");
    }

    const token = authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET_KEY as string, (err, hashData) => {
      if (err) {
        return res.status(403).json("Token is invalid");
      }
      req.body = { ...req.body, hashData };
      next();
    });
  },


  encodeRequest: async (req: Request, res: Response, next: NextFunction) => {
    const secret:string = process.env.HASH_CIPHER_TEXT as string
    const {metadata} = req.body
    console.log("hash from front-end", metadata)

    const newData =  await AES.decrypt(metadata , secret).toString(enc.Utf8)
    req.body = {...req.body,...JSON.parse(newData)}    
    next()
  },
};

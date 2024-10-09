import mongoose from "mongoose";
import { IUser } from "../types/user";
import bcrypt from "bcryptjs"




const UserSchema = new mongoose.Schema({
    fullName: {type:String, require:true},
    userName:  {type:String, require: true, unique: true},
    password : {type:String},
    role:  {type:String, enum:['ADMIN',"USER"] , default: "USER"},
}, {timestamps: true})
UserSchema.pre("save",async function (next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password as string,12)
    }
    next();
})

const User = mongoose.model<IUser>("User", UserSchema)
export default User
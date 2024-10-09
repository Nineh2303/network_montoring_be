import mongoose from "mongoose"


export const DBRunning =()=>{
    mongoose.connect(process.env.DB_URL as string).then(()=>{
        console.log("DB connected")
    }).catch(err=>{
        console.log(err)
    })
}
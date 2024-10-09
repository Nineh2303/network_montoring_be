import express ,{Request,Response} from "express"
import dotenv from "dotenv"

import cors from "cors"
import { DBRunning } from "./configs/DBConfig"
import userRoutes from "./routes/UserRoutes"
import billRoutes from "./routes/BillRoutes"
dotenv.config()

const PORT = process.env.PORT || 5000
const app = express()
app.use(cors())
app.use(express.json())
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/bill", billRoutes)

DBRunning()
app.listen(PORT,()=>{
    console.log(`Server is running at ${PORT}`)
})  
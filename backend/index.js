import express from "express";
import mainRouter from "./routes/index.js"
import cors from "cors"
import { connect } from "./db/db.js";



const app = express();
app.use(express.json())
app.use(cors({
  credentials : true,
}))

connect().then(()=> {
  console.log("Database is Connected Running on Port: 3000")
})

app.use("/api/v1" , mainRouter )

// api/vi/user  --> user routes 

app.listen(3000)


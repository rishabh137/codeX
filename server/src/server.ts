import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.get('/', (req, res)=>{
    res.send("hello");
})

app.listen(PORT, ()=>{
    console.log(`The application started at port http://localhost:${PORT}`);
})
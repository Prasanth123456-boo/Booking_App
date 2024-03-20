import express from "express";// framework
import dotenv from 'dotenv'; // keep confidential data
import mongoose from "mongoose"; // DB
import cors from "cors" //connect to node and react without any cors error
import Auth from "./router/user.router.js"

//MVC model view controller

const app = express();
dotenv.config();

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST, PATCH, DELETE, OPTIONS");
  next();
});


app.use(cors());


app.use("/api",Auth); 



const PORT = process.env.PORT || 5000
mongoose.connect(process.env.MONGO_URL, {
  
})
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port http://localhost:${PORT} || Connected To Database Successfully`);
    });
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});



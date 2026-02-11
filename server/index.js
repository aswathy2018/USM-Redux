import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import authRoutes from "./routes/authRoutes.js"
import adminRoutes from "./routes/adminRoute.js"
import cookieParser from "cookie-parser"

dotenv.config()
const app = express()

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/", authRoutes);
app.use("/uploads", express.static("uploads"));

app.use("/admin", adminRoutes);  

mongoose.connect(process.env.MONGO_URL)
    .then(()=>console.log("MongoDB Connected"))
    .catch(err=>console.log(err));

app.listen(process.env.PORT || 5000, () =>
  console.log("Server running on port 5000")
);
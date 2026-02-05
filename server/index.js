import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import authRoutes from "./routes/authRoutes.js"
import adminRoutes from "./routes/adminRoute.js"
import adminUserRoutes from "./routes/adminRoute.js"

dotenv.config()
const app = express()

app.use(cors());
app.use(express.json());

app.use("/", authRoutes);
app.use("/uploads", express.static("uploads"));

app.use("/admin", adminRoutes);
app.use("/admin", adminUserRoutes);  

mongoose.connect(process.env.MONGO_URL)
    .then(()=>console.log("MongoDB Connected"))
    .catch(err=>console.log(err));

app.listen(process.env.PORT || 5000, () =>
  console.log("Server running on port 5000")
);
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const aiRoutes = require("./routes/aiRoutes");

dotenv.config();
connectDB();

const app = express();

console.log(process.env.OPENAI_API_KEY); // testing
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/ai", aiRoutes);

app.get("/", (req, res) => {
  res.send("Real Estate API Running...");
});

// 👇 THIS IS WHAT YOU ADD
mongoose.connection.on("connected", () => {
  console.log("DB Name:", mongoose.connection.name);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

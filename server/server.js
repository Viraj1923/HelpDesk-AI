import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import kbRoutes from "./routes/kb.js";
import ticketRoutes from "./routes/tickets.js";
import auditRoutes from "./routes/audit.js";
import articleRoutes from "./routes/articles.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth",authRoutes);
app.use("/api/kb", kbRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/articles", articleRoutes);



app.get("/", (req, res) => {
    res.send("HelpDesk API Running...");
});

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected ");

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Error connecting to MongoDB", err.message);

    }
};

start();
import express from "express";
import AuditLog from "../models/AuditLog.js";
import authMiddleware from "../utils/authMiddleware.js";

const router = express.Router();

// GET audit logs for a ticket
router.get("/:ticketId", authMiddleware(["user", "agent", "admin"]), async (req, res) => {
    try {
        const { ticketId } = req.params;

        const logs = await AuditLog.find({ ticketId }).sort({ timestamp: 1 });
        res.json(logs);
    } catch (err) {
        console.error(err);
        res.json({ msg: "Error fetching audit logs" });
    }
});

export default router;

import express from "express";
import Ticket from "../models/Ticket.js";
import authMiddleware from "../utils/authMiddleware.js";
import { runAgentWorkflow } from "../services/agentService.js";
import AgentSuggestion from "../models/AgentSuggestion.js";
import { logAction } from "../utils/auditLogger.js";


const router = express.Router();

// CREATE ticket
router.post("/", authMiddleware(["user", "agent", "admin"]), async (req, res) => {
    try {
        const { title, description } = req.body;
        const ticket = new Ticket({
            title,
            description,
            createdBy: req.user.id
        });
        await ticket.save();

        // Log: ticket created
        await logAction(ticket._id, "Ticket created", req.user.id);

        // Run agent workflow
        const result = await runAgentWorkflow(ticket, req.user);

        // Log: agent suggestion generated
        await logAction(ticket._id, "AI Suggestion generated", "AI");

        // If auto-closed
        if (result.suggestion?.autoClosed) {
            await logAction(ticket._id, "Ticket auto-closed", "AI");
        }
        res.json(result);
    } catch (err) {
        console.error(err);
        res.json({ msg: "Error creating ticket" });
    }
});

// GET tickets 
router.get("/", authMiddleware(["user", "agent", "admin"]), async (req, res) => {
    try {
        let tickets;
        if (req.user.role === "user") {
            // show only my tickets
            tickets = await Ticket.find({ createdBy: req.user.id });
        } else {
            // admin/agent sees all
            tickets = await Ticket.find().populate("createdBy", "name email");
        }
        res.json(tickets);
    } catch (err) {
        console.error(err);
        res.json({ msg: "Error fetching tickets" });
    }
});

// GET single ticket by id
router.get("/:id", authMiddleware(["user", "agent", "admin"]), async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id).populate("createdBy", "name email");
        if (!ticket) return res.json({ msg: "Ticket not found" });

        const suggestion = await AgentSuggestion.findOne({ ticketId: ticket._id });

        res.json({ ticket, suggestion });
    } catch (err) {
        console.error(err);
        res.json({ msg: "Error fetching ticket" });
    }
});

// PATCH ticket status (Agent/Admin can update)
router.patch("/:id/status", authMiddleware(["agent", "admin"]), async (req, res) => {
    try {
        const { status } = req.body;

        // allow only certain statuses
        const allowedStatuses = ["open", "waiting_human", "resolved", "closed"];
        if (!allowedStatuses.includes(status)) {
            return res.json({ msg: "Invalid status" });
        }

        const ticket = await Ticket.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!ticket) return res.json({ msg: "Ticket not found" });

        // log the change
        await AuditLog.create({
            ticketId: ticket._id,
            action: `Status updated to ${status}`,
            performedBy: req.user.id,
        });

        res.json(ticket);
    } catch (err) {
        console.error(err);
        res.json({ msg: "Error updating ticket status" });
    }
});


export default router;

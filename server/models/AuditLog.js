import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
    {
        ticketId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ticket"
        },
        traceId: {
            type: String,
            required: true
        },
        actor: {
            type: String,
            enum: ["system", "agent", "user"]
        },
        action: String, 
        meta: Object,
        timestamp: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: false }
);

export default mongoose.model("AuditLog", auditLogSchema);

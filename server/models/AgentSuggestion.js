import mongoose from "mongoose";

const agentSuggestionSchema = new mongoose.Schema(
    {
        ticketId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Ticket"
        },
        predictedCategory: String,
        articleIds: [String],
        draftReply: String,
        confidence: Number,
        autoClosed: {
            type: Boolean, default: false
        },
        modelInfo: {
            provider: String,
            model: String,
            promptVersion: String,
            latencyMs: Number
        }
    },
    { timestamps: true }
);

export default mongoose.model("AgentSuggestion", agentSuggestionSchema);

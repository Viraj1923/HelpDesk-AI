import AgentSuggestion from "../models/AgentSuggestion.js";
import AuditLog from "../models/AuditLog.js";
import { classify, draftReply, generateConfidence } from "../utils/agentStub.js";

export async function runAgentWorkflow(ticket, user) {
    // classify + draft
    const category = classify(ticket.description || ticket.title);
    const reply = draftReply(ticket.description || ticket.title, category);
    const confidence = parseFloat(generateConfidence());

    const autoClosed = confidence >= 0.8; // use threshold

    // save suggestion
    const suggestion = await AgentSuggestion.create({
        ticketId: ticket._id,
        predictedCategory: category,
        articleIds: [`${category}_DOC_1`, `${category}_DOC_2`],
        draftReply: reply,
        confidence,
        autoClosed,
        modelInfo: { provider: "stub", model: "rule-based", promptVersion: "v2" }
    });

    // log
    await AuditLog.create({
        ticketId: ticket._id,
        action: `AI classified as ${category} with confidence ${confidence}`,
        performedBy: user.id
    });

    if (autoClosed) {
        ticket.status = "closed";
        await ticket.save();
        await AuditLog.create({
            ticketId: ticket._id,
            action: `Ticket auto-closed by AI (confidence ${confidence})`,
            performedBy: "AI"
        });
    }

    return { ticket, suggestion };
}

import AuditLog from "../models/AuditLog.js";

export async function logAction(ticketId, action, performedBy = "system") {
  try {
    const log = new AuditLog({
      ticketId,
      action,
      performedBy
    });
    await log.save();
  } catch (err) {
    console.error("Error saving audit log:", err);
  }
}

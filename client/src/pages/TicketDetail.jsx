import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api";
import { AuthContext } from "../context/AuthContext";

function TicketDetail() {
    const { id } = useParams();
    const { token } = useContext(AuthContext);
    const [ticket, setTicket] = useState(null);
    const [suggestion, setSuggestion] = useState(null);
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        if (!token) return;

        const fetchTicket = async () => {
            try {
                const res = await api.get(`/tickets/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTicket(res.data.ticket || res.data);
                if (res.data.suggestion) setSuggestion(res.data.suggestion);
            } catch (err) {
                console.error("Error fetching ticket", err);
            }
        };

        const fetchLogs = async () => {
            try {
                const res = await api.get(`/audit/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setLogs(res.data);
            } catch (err) {
                console.error("Error fetching logs", err);
            }
        };

        fetchTicket();
        fetchLogs();
    }, [id, token]);

    if (!ticket) return <p className="p-6">Loading...</p>;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <Link
                to="/tickets"
                className="text-blue-600 hover:underline text-sm mb-4 inline-block"
            >
                ← Back to Tickets
            </Link>

            {/* Ticket Info */}
            <div className="bg-white shadow rounded p-5 mb-6">
                <h2 className="text-2xl font-bold mb-2">{ticket.title}</h2>
                <p className="mb-2">{ticket.description}</p>
                <div className="flex gap-4 text-sm text-gray-600">
                    <span>
                        Category:{" "}
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                            {ticket.category}
                        </span>
                    </span>
                    <span>
                        Status:{" "}
                        <span
                            className={`px-2 py-1 rounded text-xs ${
                                ticket.status === "resolved"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                            }`}
                        >
                            {ticket.status}
                        </span>
                    </span>
                </div>
            </div>

            {/* AI Suggestion */}
            {suggestion && (
                <div className="bg-gray-50 border rounded p-5 mb-6">
                    <h3 className="font-bold mb-2">🤖 AI Suggestion</h3>
                    <p className="mb-2">{suggestion.draftReply}</p>
                    <p className="text-sm text-gray-600">
                        Confidence:{" "}
                        <span className="font-semibold">{suggestion.confidence}</span>
                    </p>
                    {suggestion.autoClosed && (
                        <p className="text-red-600 font-semibold mt-2">
                            ⚡ Auto-Closed by AI
                        </p>
                    )}
                </div>
            )}

            {/* Audit Logs */}
            <div className="bg-white shadow rounded p-5">
                <h3 className="font-bold mb-2">📜 Audit Log</h3>
                {logs.length === 0 ? (
                    <p className="text-sm text-gray-500">No logs available.</p>
                ) : (
                    <ul className="text-sm text-gray-700 space-y-1">
                        {logs.map((log) => (
                            <li key={log._id} className="border-b pb-1">
                                {log.action} —{" "}
                                <span className="text-gray-500">
                                    {new Date(log.createdAt).toLocaleString()}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default TicketDetail;

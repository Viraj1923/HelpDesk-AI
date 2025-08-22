import { useEffect, useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext";

function AgentDashboard() {
    const { token } = useContext(AuthContext);
    const [tickets, setTickets] = useState([]);

    // Fetch tickets
    useEffect(() => {
        if (!token) return;
        const fetchTickets = async () => {
            try {
                const res = await api.get("/tickets", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                // filter only open / waiting_human tickets
                const openTickets = res.data.filter(
                    (t) => t.status === "open" || t.status === "waiting_human"
                );
                setTickets(openTickets);
            } catch (err) {
                console.error("Error fetching tickets:", err);
            }
        };
        fetchTickets();
    }, [token]);

    // Mark ticket as resolved
    const markResolved = async (id) => {
        try {
            await api.patch(
                `/tickets/${id}/status`,
                { status: "resolved" },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // update UI
            setTickets((prev) => prev.filter((t) => t._id !== id));
        } catch (err) {
            console.error("Error updating ticket:", err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">🛠️ Agent Dashboard</h2>

                {tickets.length === 0 ? (
                    <p className="text-gray-600 text-center">✅ No open tickets 🎉</p>
                ) : (
                    <div className="space-y-4">
                        {tickets.map((ticket) => (
                            <div
                                key={ticket._id}
                                className="bg-gray-50 shadow p-4 rounded-lg flex justify-between items-center hover:shadow-lg transition"
                            >
                                <div>
                                    <h3 className="text-lg font-semibold">{ticket.title}</h3>
                                    <p className="text-sm text-gray-600">
                                        Category:{" "}
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                            {ticket.category || "N/A"}
                                        </span>
                                    </p>
                                    <p className="text-sm mt-1">
                                        Status:{" "}
                                        <span
                                            className={`px-2 py-1 rounded text-xs ${
                                                ticket.status === "waiting_human"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            {ticket.status}
                                        </span>
                                    </p>
                                </div>
                                <button
                                    onClick={() => markResolved(ticket._id)}
                                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                                >
                                    ✅ Mark Resolved
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AgentDashboard;

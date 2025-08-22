import { useEffect, useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext";

function AdminDashboard() {
    const { token } = useContext(AuthContext);
    const [tickets, setTickets] = useState([]);
    const [stats, setStats] = useState({ total: 0, resolved: 0, autoClosed: 0 });

    useEffect(() => {
        if (!token) return;
        const fetchTickets = async () => {
            try {
                const res = await api.get("/tickets", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTickets(res.data);

                // calculate simple stats
                const total = res.data.length;
                const resolved = res.data.filter((t) => t.status === "resolved").length;
                const autoClosed = res.data.filter((t) => t.status === "closed").length;

                setStats({ total, resolved, autoClosed });
            } catch (err) {
                console.error("Error fetching tickets:", err);
            }
        };
        fetchTickets();
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">📊 Admin Dashboard</h2>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    <div className="p-6 bg-blue-100 rounded-lg text-center shadow">
                        <p className="text-xl font-bold text-blue-800">{stats.total}</p>
                        <p className="text-gray-600">Total Tickets</p>
                    </div>
                    <div className="p-6 bg-green-100 rounded-lg text-center shadow">
                        <p className="text-xl font-bold text-green-800">{stats.resolved}</p>
                        <p className="text-gray-600">Resolved</p>
                    </div>
                    <div className="p-6 bg-yellow-100 rounded-lg text-center shadow">
                        <p className="text-xl font-bold text-yellow-800">{stats.autoClosed}</p>
                        <p className="text-gray-600">Auto-Closed</p>
                    </div>
                </div>

                {/* Tickets List */}
                <h3 className="text-lg font-semibold mb-4">📝 All Tickets</h3>
                <div className="space-y-4">
                    {tickets.map((ticket) => (
                        <div
                            key={ticket._id}
                            className="p-4 bg-gray-50 border rounded-lg shadow hover:shadow-md transition"
                        >
                            <h4 className="font-semibold text-lg">{ticket.title}</h4>
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
                                        ticket.status === "resolved"
                                            ? "bg-green-100 text-green-700"
                                            : ticket.status === "closed"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    {ticket.status}
                                </span>
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                By: {ticket.createdBy?.email || "Unknown"}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;

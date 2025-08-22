import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { AuthContext } from "../context/AuthContext";

function Tickets() {
    const { token } = useContext(AuthContext);
    const [tickets, setTickets] = useState([]);
    const [form, setForm] = useState({ title: "", description: "", category: "" });

    // Fetch tickets
    useEffect(() => {
        if (!token) return;
        const fetchTickets = async () => {
            try {
                const res = await api.get("/tickets", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTickets(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchTickets();
    }, [token]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/tickets", form, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // Add whole res.data, not res.data.ticket
            setTickets([...tickets, res.data]);
            setForm({ title: "", description: "", category: "" });
        } catch (err) {
            console.error(err);
            alert("Ticket creation failed");
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">🎫 Tickets</h2>

                {/* Create Ticket Form */}
                <div className="max-w-md mx-auto mb-8">
                    <h3 className="text-lg font-bold mb-4 text-center">Create New Ticket</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            name="title"
                            placeholder="Title"
                            value={form.title}
                            onChange={handleChange}
                            className="w-full border rounded p-2 focus:ring focus:ring-blue-300"
                        />&nbsp;&nbsp;&nbsp;
                        <textarea
                            name="description"
                            placeholder="Description"
                            value={form.description}
                            onChange={handleChange}
                            className="w-full border rounded p-2 focus:ring focus:ring-blue-300"
                        />&nbsp;&nbsp;&nbsp;
                        <input
                            name="category"
                            placeholder="Category (e.g. tech, billing)"
                            value={form.category}
                            onChange={handleChange}
                            className="w-full border rounded p-2 focus:ring focus:ring-blue-300"
                        />&nbsp;&nbsp;&nbsp;
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
                        >
                            Create Ticket
                        </button>
                    </form>
                </div><br /><br />

                {/* Ticket List */}
                <div className="space-y-3">
                    {tickets.length === 0 ? (
                        <p className="text-gray-500 text-center">No tickets yet. Create one 🚀</p>
                    ) : (
                        tickets.map((ticket) => (
                            <div
                                key={ticket._id}
                                className="bg-gray-50 shadow p-4 rounded flex justify-between items-center"
                            >
                                <div>
                                    <Link
                                        to={`/tickets/${ticket._id}`}
                                        className="text-lg font-semibold text-blue-600 hover:underline"
                                    >
                                        {ticket.title}
                                    </Link>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Category:{" "}
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                            {ticket.category || "N/A"}
                                        </span>{" "}
                                        | Status:{" "}
                                        <span
                                            className={`px-2 py-1 rounded text-xs ${ticket.status === "resolved"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                                }`}
                                        >
                                            {ticket.status}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Tickets;

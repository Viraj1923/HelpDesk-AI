import { useState, useEffect, useContext } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext";

function Articles() {
    const { token, user } = useContext(AuthContext);
    const [articles, setArticles] = useState([]);
    const [form, setForm] = useState({ title: "", body: "", tags: "" });

    // Fetch all articles
    useEffect(() => {
        if (!token) return;
        const fetchArticles = async () => {
            try {
                const res = await api.get("/articles", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setArticles(res.data);
            } catch (err) {
                console.error("Error fetching articles:", err);
            }
        };
        fetchArticles();
    }, [token]);

    // Handle input
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Create new article
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post(
                "/articles",
                { ...form, tags: form.tags.split(",").map((t) => t.trim()) },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setArticles([...articles, res.data]); // add new one to list
            setForm({ title: "", body: "", tags: "" });
        } catch (err) {
            console.error("Error creating article:", err);
            alert("Only admins can create articles");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-6 text-center">📚 Knowledge Base Articles</h2>

                {/* Create Article Form (Admin Only) */}
                {user?.role === "admin" && (
                    <div className="max-w-lg mx-auto mb-10">
                        <h3 className="text-lg font-semibold mb-4 text-center">➕ Add New Article</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                name="title"
                                placeholder="Article Title"
                                value={form.title}
                                onChange={handleChange}
                                className="w-full border rounded p-2 focus:ring focus:ring-blue-300"
                            />&nbsp;&nbsp;&nbsp;
                            <textarea
                                name="body"
                                placeholder="Article Content"
                                value={form.body}
                                onChange={handleChange}
                                rows="4"
                                className="w-full border rounded p-2 focus:ring focus:ring-blue-300"
                            />&nbsp;&nbsp;&nbsp;
                            <input
                                name="tags"
                                placeholder="Tags (comma-separated)"
                                value={form.tags}
                                onChange={handleChange}
                                className="w-full border rounded p-2 focus:ring focus:ring-blue-300"
                            />&nbsp;&nbsp;&nbsp;
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
                            >
                                Add Article
                            </button>
                        </form>
                    </div>
                )}

                {/* Articles List */}
                <div className="space-y-4">
                    {articles.length === 0 ? (
                        <p className="text-gray-500 text-center">No articles yet. 🚀</p>
                    ) : (
                        articles.map((a) => (
                            <div
                                key={a._id}
                                className="bg-gray-50 shadow-md p-4 rounded-lg hover:shadow-lg transition"
                            >
                                <h3 className="font-bold text-lg mb-2">{a.title}</h3>
                                <p className="text-sm text-gray-700 mb-2">{a.body}</p>
                                <div className="flex flex-wrap gap-2 text-xs">
                                    {a.tags.map((tag, i) => (
                                        <span
                                            key={i}
                                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-400 mt-2">Status: {a.status}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Articles;

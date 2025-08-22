import express from "express";
import Article from "../models/Article.js";
import authMiddleware from "../utils/authMiddleware.js";

const router = express.Router();

// CREATE article (Admin only)
router.post("/", authMiddleware(["admin"]), async (req, res) => {
    try {
        const { title, body, tags, status } = req.body;
        const article = new Article({ title, body, tags, status });
        await article.save();
        res.json(article);
    } catch (err) {
        res.json({ msg: "Error creating article" });
    }
});

// READ articles (anyone can search/list)
router.get("/", async (req, res) => {
    try {
        const { query } = req.query;
        let articles;
        if (query) {
            articles = await Article.find({
                $or: [
                    { title: new RegExp(query, "i") },
                    { body: new RegExp(query, "i") },
                    { tags: query }
                ],
                status: "published"
            });
        } else {
            articles = await Article.find({ status: "published" });
        }
        res.json(articles);
    } catch (err) {
        res.json({ msg: "Error fetching articles" });
    }
});

// UPDATE article (Admin only)
router.put("/:id", authMiddleware(["admin"]), async (req, res) => {
    try {
        const { title, body, tags, status } = req.body;
        const article = await Article.findByIdAndUpdate(
            req.params.id,
            { title, body, tags, status },
            { new: true }
        );
        res.json(article);
    } catch (err) {
        res.json({ msg: "Error updating article" });
    }
});

// DELETE article (Admin only)
router.delete("/:id", authMiddleware(["admin"]), async (req, res) => {
    try {
        await Article.findByIdAndDelete(req.params.id);
        res.json({ msg: "Article deleted" });
    } catch (err) {
        res.json({ msg: "Error deleting article" });
    }
});

export default router;

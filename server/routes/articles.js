import express from "express";
import Article from "../models/Article.js";
import authMiddleware from "../utils/authMiddleware.js";

const router = express.Router();

// CREATE (admin only)
router.post("/", authMiddleware(["admin"]), async (req, res) => {
    try {
        const { title, body, tags } = req.body;
        const article = new Article({
            title,
            body,
            tags,
            status: "published"
        });
        await article.save();
        res.json(article);
    } catch (err) {
        console.error(err);
        res.json({ msg: "Error creating article" });
    }
});

// READ all
router.get("/", authMiddleware(["user", "agent", "admin"]), async (req, res) => {
    try {
        const articles = await Article.find();
        res.json(articles);
    } catch (err) {
        console.error(err);
        res.json({ msg: "Error fetching articles" });
    }
});

// READ single
router.get("/:id", authMiddleware(["user", "agent", "admin"]), async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) return res.json({ msg: "Article not found" });
        res.json(article);
    } catch (err) {
        console.error(err);
        res.json({ msg: "Error fetching article" });
    }
});

// UPDATE (admin only)
router.put("/:id", authMiddleware(["admin"]), async (req, res) => {
    try {
        const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(article);
    } catch (err) {
        console.error(err);
        res.json({ msg: "Error updating article" });
    }
});

// DELETE (admin only)
router.delete("/:id", authMiddleware(["admin"]), async (req, res) => {
    try {
        await Article.findByIdAndDelete(req.params.id);
        res.json({ msg: "Article deleted" });
    } catch (err) {
        console.error(err);
        res.json({ msg: "Error deleting article" });
    }
});

export default router;

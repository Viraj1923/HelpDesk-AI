import jwt from "jsonwebtoken";

const authMiddleware = (roles = []) => {
    return (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token) return res.json({ msg: "No token, auth denied" });

            const decoded = jwt.verify(token, process.env.JWT_KEY);
            req.user = decoded;

            if (roles.length && !roles.includes(req.user.role)) {
                return res.json({ msg: "Access denied" });
            }
            next();
        } catch (err) {
            console.error(err);
            res.json({ msg: "Invalid token" });
        }
    };
};

export default authMiddleware;
const jwt = require("jsonwebtoken");

const adminAuth = async (req, res, next) => {
    try {
        const authHeader = req.get("authorization");
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                status: "failed",
                message: "Access denied. No token provided."
            });
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (!decodedToken.isAdmin) {
            return res.status(403).json({
                status: "failed",
                message: "Access denied. Admin privileges required."
            });
        }

        req.admin = decodedToken;
        return next(); // Always return next()
    } catch (e) {
        return res.status(401).json({
            status: "failed",
            message: "Invalid or expired token."
        });
    }
};

module.exports = adminAuth;
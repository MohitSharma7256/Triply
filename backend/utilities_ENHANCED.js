const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    console.log("Auth attempt:", {
        hasAuthHeader: !!authHeader,
        hasToken: !!token,
        path: req.path
    });

    if (!token) {
        console.log("❌ No token provided");
        return res.status(401).json({
            error: true,
            message: "Access token missing",
            details: "Please login again"
        });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log("❌ Token verification failed:", err.message);

            if (err.name === 'TokenExpiredError') {
                return res.status(403).json({
                    error: true,
                    message: "Token expired",
                    details: "Please login again"
                });
            }

            return res.status(403).json({
                error: true,
                message: "Invalid token",
                details: err.message
            });
        }

        console.log("✅ Token verified for user:", user.userId);
        req.user = user;
        next();
    });
}

module.exports = { authenticateToken };

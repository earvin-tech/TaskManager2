const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}

const requireAuth = (request, response, next) => {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        response.status(401);
        throw new Error("Unauthorized: No token provided");
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        request.user = { _id: decoded.id };
        next();
    } catch(err) {
        console.error("JWT verification failed:", err.message);
        response.status(401);
        throw new Error("Unauthorized: Invalid token");
    }
};

module.exports = requireAuth;
const admin = require("../config/firebase");

const verifyToken = async (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Authorization token missing"
        });
    }

    try {

        const token = authHeader.split(" ")[1];

        const decoded = await admin.auth().verifyIdToken(token);

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Invalid or expired token"
        });

    }
};

module.exports = verifyToken;
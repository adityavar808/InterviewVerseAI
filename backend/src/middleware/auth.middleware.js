import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

const protect = async (req, res, next) => {

    try {

        let token;

        // Check Authorization Header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {

            token = req.headers.authorization.split(" ")[1];
        }


        // No token
        if (!token) {

            return res.status(401).json({
                success: false,
                message: "Not authorized, no token",
            });
        }


        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_ACCESS_SECRET
        );


        // Find user
        req.user = await User.findById(decoded.id).select("-password");


        next();

    }

    catch (error) {

        return res.status(401).json({
            success: false,
            message: "Token failed",
        });
    }
};

export default protect;
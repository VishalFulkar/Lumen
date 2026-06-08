const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        if (!token)
            return res.status(401).json({
                message: 'Unauthorized'
            });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded?.userId)
            return res.status(401).json({
                message: 'Unauthorized'
            });

        const user = await userModel.findById(decoded.userId);
        if (!user)
            return res.status(401).json({
                message: 'Unauthorized'
            });

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError')
            return res.status(401).json({
                message: 'Token expired'
            });
        if (error.name === 'JsonWebTokenError')
            return res.status(401).json({
                message: 'Invalid token'
            });
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
};

module.exports = { protect };
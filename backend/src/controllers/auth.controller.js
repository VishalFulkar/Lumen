const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

async function registerUser(req, res) {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name)
            return res.status(400).json({
                message: 'All fields are required'
            });

        const exists = await userModel.findOne({ email });
        if (exists)
            return res.status(400).json({
                message: 'User already exists'
            });

        const user = await userModel.create({ email, password, name });

        const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });

        await userModel.findByIdAndUpdate(user._id, { refreshToken });

        const cookieOpts = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        };

        res.cookie('accessToken', accessToken, {
            ...cookieOpts,
            maxAge: 15 * 60 * 1000
        });
        res.cookie('refreshToken', refreshToken, {
            ...cookieOpts,
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: { _id: user._id, name: user.name, email: user.email },
        });

    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message || 'Internal server error'
        });
    }
}

async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const user = await userModel.findOne({ email }).select("+password");
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });

        await userModel.findByIdAndUpdate(user._id, { refreshToken });

        const cookieOpts = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        };

        res.cookie('accessToken', accessToken, {
            ...cookieOpts,
            maxAge: 15 * 60 * 1000
        });
        res.cookie('refreshToken', refreshToken, {
            ...cookieOpts,
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: 'User logged in successfully',
            user: { _id: user._id, name: user.name, email: user.email },
        });

    } catch (error) {
        res.status(500).json({
            message: error.message || "Internal server error",
        });
    }
}

async function logoutUser(req, res) {
    try {
        // Invalidate refresh token in DB
        if (req.user?._id) {
            await userModel.findByIdAndUpdate(req.user._id, { refreshToken: null });
        }
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        res.status(200).json({
            message: 'User logged out successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            message: error.message || 'Internal server error'
        });
    }
}

const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token)
            return res.status(401).json({
                message: 'Unauthorized'
            });

        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const user = await userModel.findById(decoded.userId).select('+refreshToken');

        if (!user || user.refreshToken !== token)
            return res.status(401).json({
                message: 'Invalid refresh token'
            });

        const newAccessToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 15 * 60 * 1000,
        });

        res.status(200).json({
            message: 'Token refreshed'
        });
    } catch (error) {
        if (error.name === 'TokenExpiredError')
            return res.status(401).json({
                message: 'Refresh token expired, please login again'
            });
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }
};

const getMe = async (req, res) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            return res.status(200).json({ user: null });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded?.userId) {
            return res.status(200).json({ user: null });
        }

        const user = await userModel.findById(decoded.userId);
        if (!user) {
            return res.status(200).json({ user: null });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(200).json({ user: null });
    }
};

module.exports = { registerUser, loginUser, logoutUser, refreshToken, getMe };

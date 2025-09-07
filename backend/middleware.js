const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Users=require('./models/users');

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key';

// Mock user DB (replace with real DB in production)

// Middleware to check authentication
// Middleware to check authentication using cookie
function checkAuth(req, res, next) {
    const token = req.cookies && req.cookies.token;
    if (!token) return res.status(401).json({ message: 'No token provided' });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = { name: decoded.name, id: decoded.id, role: decoded.role };
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
}

// Sign up middleware
async function signUp(req, res) {
    const { email, password, name , role } = req.body;
    const user = await Users.findOne({ email: email });
    if (user) {
        return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Users({ email: email, passwordHash: hashedPassword, name: name , role: role });
    await newUser.save();
    const token = jwt.sign({ name:newUser.name, id: newUser._id, role: newUser.role }, SECRET_KEY, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' , sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax' });
    res.status(201).json({ message: 'User registered successfully' });
}

// Sign in middleware
async function signIn(req, res) {
    const { email, password } = req.body;
    const user = await Users.findOne({ email: email });
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ name: user.name, id: user._id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
    res.cookie('token', token, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    });
    res.status(200).json({ message: 'Signed in successfully' });
}

function signOut(req, res) {
    res.clearCookie('token');
    res.status(200).json({ message: 'Signed out successfully' });
}

module.exports = {
    checkAuth,
    signUp,
    signIn,
    signOut,
};
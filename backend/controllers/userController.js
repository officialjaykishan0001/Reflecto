const User = require('../models/user.model');
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs');

exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "User already exists" })

        // Hash the password using bcryptjs
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const user = await User.create({
            username,
            email,
            password: hashedPassword
        })

        res.status(201).json({ id: user._id, username: user.username });
    }catch(err){
        res.status(500).json({ error: err.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try{
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id}, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie('token', token);

        res.json({ token, user });
    }catch(err){
        res.status(500).json({ error: err.message });
    }
}
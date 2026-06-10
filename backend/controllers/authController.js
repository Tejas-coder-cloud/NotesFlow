const user = require("../models/user")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const registerUser = async (req, res) => {
    console.log("REGISTER ROUTE HIT")
    const { name, password } = req.body;
    const email=req.body.email.toLowerCase();
    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }
    const userExists = await user.findOne({ email });
    if (userExists) {
        return res.status(400).json({
            message: "User already exists"
        });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Original Password:", password);
    console.log("Hashed Password:", hashedPassword);
    const newUser = await user.create({
        name,
        email,
        password: hashedPassword
    });
    console.log("New User Saved:", newUser);
    const token = jwt.sign(
        {
            email: email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );
    res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email
        }
    });
};
const loginUser = async (req, res) => {

    const { email, password } = req.body;
    console.log("Email received",email);
    

    // Validation
    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required"
        });
    }

    // Check if user exists
    const existingUser = await user.findOne({ email });
    console.log("User found",existingUser);

    if (!existingUser) {
        return res.status(400).json({
            message: "Invalid credentials"
        });
    }

    // Compare password
    const isMatch = await bcrypt.compare(
        password,
        existingUser.password
    );
    console.log("Password Match",isMatch);

    if (!isMatch) {
        return res.status(400).json({
            message: "Invalid credentials"
        });
    }

    // Generate JWT
    const token = jwt.sign(
        {
            id: existingUser._id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1d"
        }
    );

    // Send response
    res.status(200).json({
        message: "Login successful",
        token,
        user: {
            id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email
        }
    });
};
module.exports = {
    registerUser,
    loginUser
};
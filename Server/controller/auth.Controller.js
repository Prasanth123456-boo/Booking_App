import bcrypt from 'bcrypt';
import User from '../model/user.models.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const {
            username,
            email,
            password,
            phoneNumber,
            firstName,
            lastName
        } = req.body;

        const salt = await bcrypt.genSalt(); // password hashing
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: passwordHash,
            phoneNumber,
            firstName,
            lastName
        });

        const savedUser = await newUser.save();

        res.status(201).json(savedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const validPassword = await bcrypt.compare(password, user.password); //compare hashed password
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        res.json({ accessToken, refreshToken, isAdmin: user.isAdmin });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const generateAccessToken = (user) => {
    return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
};
const generateRefreshToken = (user) => {
    return jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
};


export const verifyToken = async(req,res)=>{
    const username = req.user;
    res.send(`Welcome, ${username}!`);
}



  
// this code is used to create a access token using refresh token

export const refresh_token = async (req, res) => {
    const { refresh } = req.body;
  
    if (!refresh) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }
  
    try {
      
      const decoded = jwt.verify(refresh, REFRESH_TOKEN_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const accessToken = generateAccessToken(decoded.userId);
      res.status(200).json({ access: accessToken });
    } catch (error) {
      res.status(401).json({ error: 'Invalid refresh token' });
    }
  };
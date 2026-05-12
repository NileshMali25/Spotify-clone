require('dotenv').config();
const express=require('express');
const cookieParser=require('cookie-parser');
const userModel=require('./models/user.model');
const authRoutes=require('./routes/auth.route');
const musicRoutes=require('./routes/music.route');

const cors = require('cors');

const app=express();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth',authRoutes);
app.use('/api/music',musicRoutes);

module.exports=app;
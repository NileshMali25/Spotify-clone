const userModel=require('../models/user.model');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
};

async function registerUser(req,res){
    const {username,email,password,role="user"}=req.body;

    const isUserAlreadyExists=await userModel.findOne({$or:[{email},{username}]});

    if(isUserAlreadyExists){
        return res.status(400).json({message:"User already exists"});
    }

    const hash=await bcrypt.hash(password,10);

    const user=await userModel.create({username,email,password:hash,role});

    const token=jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET);

    res.cookie('token', token, cookieOptions);

    res.status(201).json({message:"User registered successfully",
    user:{
        id:user._id,
        username:user.username,
        email:user.email,
        role:user.role
    }
});
}

async function loginUser(req,res){
    const {username,email,password}=req.body;

    const user=await userModel.findOne({$or:[{email},{username}]});

    if(!user){
        return res.status(400).json({message:"Invalid credentials"});
    }

    const isPasswordMatch=await bcrypt.compare(password,user.password);

    if(!isPasswordMatch){
        return res.status(400).json({message:"Invalid credentials"});
    }

    const token=jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET);

    res.cookie('token', token, cookieOptions);

    res.status(200).json({message:"User logged in successfully",
    user:{
        id:user._id,
        username:user.username,
        email:user.email,
        role:user.role
    }
});

}


async function logoutUser(req, res) {
    res.clearCookie('token', cookieOptions);

    res.status(200).json({
        message: "User logged out successfully"
    });
}

module.exports={registerUser,loginUser,logoutUser};
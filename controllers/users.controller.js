const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const {SUCCESS,FAIL, ERROR} = require('../utils/statusTexts');
const asyncWrapper = require('../middlewares/asyncWrapper');
const AppError = require('../utils/appError');
const generateJwtToken = require('../utils/generateJwtToken');

//get all users
const getAllUsers = asyncWrapper(
    async (req, res) => {
        const limit = req.query.limit || 2;
        const page = req.query.page || 1;
        const skip = (page - 1) * limit;
        const users = await User.find({},{"__v":false,password:false}).limit(limit).skip(skip);
        res.json({status:SUCCESS,data:{users}});
    }
)

const register = asyncWrapper(
    async (req,res,next)=>{
        const { firstName,lastName,email,password,role } = req.body;

        const oldUser = await User.findOne({email:email});
        if(oldUser){
            return next(AppError.create("User already exists",400,FAIL));
        }

        //hash password
        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = new User({
          firstName,lastName,
          email,password:hashedPassword,role,
          avatar:req.file.filename
        });

        //generate jwt token
        newUser.token = await generateJwtToken({email:newUser.email,id:newUser._id,role:newUser.role});
        await newUser.save();
        res.status(201).json({status:SUCCESS,data:{user:newUser}});
    }
)

const login = asyncWrapper(
    async (req,res,next)=>{
      const {email,password} = req.body;
      if(!email && !password){
        return next(AppError.create("email and password are required",400,FAIL));
      }
      const user = await User.findOne({email:email});
      if(!user){
        return next(AppError.create("user not found",400,FAIL));
      }
      const isPasswordMatched = await bcrypt.compare(password,user.password);

      if(user&&isPasswordMatched){
        const token = await generateJwtToken({email:user.email,id:user._id,role:user.role});
        res.status(200).json({status:SUCCESS,data:{token}});
      }else{
        return next(AppError.create("Invalid credentials",400,ERROR));
      }
    }
)


module.exports = {getAllUsers,register,login};
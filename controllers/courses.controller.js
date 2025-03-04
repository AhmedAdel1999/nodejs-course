const {validationResult} = require('express-validator');
const Course = require('../models/course.model');
const {SUCCESS,FAIL,ERROR} = require('../utils/statusTexts');
const asyncWrapper = require('../middlewares/asyncWrapper');
const AppError = require('../utils/appError');

//get all courses
const getAllCourses = asyncWrapper(
    async (req, res) => {
        const limit = req.query.limit || 2;
        const page = req.query.page || 1;
        const skip = (page - 1) * limit;
        const courses = await Course.find({},{"__v":false}).populate("user","email role").limit(limit).skip(skip);
        res.json({status:SUCCESS,data:{courses}});
    }
)

//get course by id
const getCourseById = asyncWrapper(
    async (req,res,next)=>{
        const course = await Course.findById(req.params.courseId.trim()).populate("user");
        if(!course){
            const error = AppError.create("Course not found",404,FAIL);
            return next(error);
         }
        return res.json({status:SUCCESS,data:{course}});
    }
) 

//create a course
const createCourse = asyncWrapper(
    async (req,res,next)=>{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const error = AppError.create(errors.array(),400,FAIL);
            return next(error);
        }else{
            const newCourse = new Course(req.body)
            await newCourse.save();
            return res.json({status:SUCCESS,data:{course:newCourse}});
        }
    }
)
//update a course
const updateCourse = asyncWrapper(
    async (req,res,next)=>{
        const courseId = req.params.courseId.trim()
        const updataedCourse = await Course.findByIdAndUpdate(courseId,{$set:{...req.body}},{new:true});
        if(!updataedCourse){
            const error = AppError.create("Course not found",404,FAIL);
            return next(error);
        }
        return res.status(200).json({status:SUCCESS,data:{course:updataedCourse}});
    }
)

//delete a course
const deleteCourse = asyncWrapper(
    async (req,res,next)=>{
        const courseId = req.params.courseId.trim()
        const deletedCourse = await Course.findByIdAndDelete(courseId);
        if(!deletedCourse){
            const error = AppError.create("Course not found",404,FAIL);
            return next(error);
        }
        return res.json({status:SUCCESS,data:null});
    }
)

module.exports = {getAllCourses,getCourseById,createCourse,updateCourse,deleteCourse};
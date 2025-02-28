const express = require('express');
const coursesContoller = require('../controllers/courses.controller');
const { validationSchema } = require('../middlewares/validationSchema');
const authMiddleware = require('../middlewares/auth');
const allowedTo = require('../middlewares/allowedTo');
const router = express.Router();


router.route("/").get(authMiddleware,coursesContoller.getAllCourses)
.post(validationSchema(),coursesContoller.createCourse)

router.route("/:courseId").get(coursesContoller.getCourseById)
.patch(coursesContoller.updateCourse)
.delete(authMiddleware,allowedTo("admin","manager"),coursesContoller.deleteCourse);

module.exports = router;
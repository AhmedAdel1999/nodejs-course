const AppError = require('../utils/appError');
const {FAIL} = require('../utils/statusTexts');
module.exports = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(AppError.create("You are not authorized to access this route",403,FAIL));
        }
        next();
    }
}
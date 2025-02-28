const jwt = require('jsonwebtoken');
const {FAIL} = require("../utils/statusTexts");

const authMiddleware = (req,res,next)=>{
    const authHeader = req.headers["Authorization"] || req.headers["authorization"];
    const token = authHeader?.split(" ")[1];
    if(!token){
        return res.status(401).json({status:FAIL,data:{message:"You are not authorized, Token is missing"}});
    }
    jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
        if(err){
            return res.status(401).json({status:FAIL,data:{message:"You are not authorized"}});
        }
        req.user = decoded;
        next();
    });
}

module.exports = authMiddleware;
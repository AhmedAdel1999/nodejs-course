require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const {FAIL} = require('./utils/statusTexts');
const coursesRouter = require('./routes/courses.routes');
const usersRouter = require('./routes/users.routes');

const app = express();
app.use("/uploads",express.static(path.join(__dirname,"uploads")));

const port = process.env.PORT || 8085;
let dbUrl = process.env.MONGO_URL;

mongoose.connect(dbUrl)
.then(()=>{
    console.log("connected to database");
}).catch((err)=>{
    console.log(err);
});

app.use(cors());
app.use(express.json());


app.use("/api/courses",coursesRouter);
app.use("/api/users",usersRouter);

//global middleware for not found routes
app.all("*",(req,res)=>{
    res.status(404).json({status:FAIL,data:{message:"This Resource IS Not Found"}});
});

//global error handler
app.use((err,req,res,next)=>{
    res.status(err.statusCode || 500).json({
      status:err.statusText || FAIL,
      message:err.message,
      code:err.statusCode,
      data:null
    });
});

app.listen(port, () => {
  console.log(`Example app listening at ${port}`);
});
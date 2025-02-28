const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        minlength:5,
        maxlength:255
    },
    price:{
        type:Number,
        required:true,
        min:100
    },
});
//compile the schema to model
module.exports = mongoose.model("Course",courseSchema);
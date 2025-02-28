const {body} = require('express-validator');

const validationSchema = () =>{
    return [
        body("title").notEmpty().withMessage("title is required"),
        body("price").exists({checkFalsy:true}).withMessage("price is required").isFloat({ min: 100 }).withMessage("Price must be at least 100"),
    ]
}
module.exports = {validationSchema};
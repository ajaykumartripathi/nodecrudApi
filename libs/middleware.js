const {check,validationResult} = require('express-validator');


module.exports.checkValidationResult = checkValidationResult; 
function checkValidationResult(req, res, next) {
    var result = validationResult(req)
    console.log(result)
    if (!result.isEmpty()) {
        res.status(400).json({
            status: "fail",
            message: result.array()[0].msg

        })
    } else {
        next(); 
    }
}
module.exports.validateAddUser = [
    check('firstname','name must be min 5 Characters').isLength({min:5}),
    check('email').not().isEmpty().withMessage('email require').isEmail().matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).withMessage('email not valid'),
    check('password').matches(/^[a-zA-Z0-9!@#$%^&*]{6,16}$/).withMessage('password should contain atleast one number and one special character')

    
];



module.exports.checkValidationResult = checkValidationResult; 
//function that validate express-validator results
function checkValidationResult(req, res, next) {
    var result = validationResult(req)
    console.log(result)
    if (!result.isEmpty()) {
        res.status(400).json({
            status: "fail",
            message: result.array()[0].msg

        })
    } else {
        next(); //go ahead if request is valid
    }
}


module.exports.validateAuthUser = [
    
    check('email','email not exist').isEmail(),
    check('password','Password  not match')
   
];
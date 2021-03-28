//************import required*************// 
const express = require('express');
const router = express.Router();
var registerloginController=require('../controllers/register-login');
var validator = require("../libs/middleware");
var token = require('../libs/verifytoken');

//************Api routes***********// 

router.post('/register',validator.validateAddUser,validator.checkValidationResult,registerloginController.register);
router.post('/login',validator.validateAuthUser,validator.checkValidationResult,registerloginController.login);
router.put('/profile',registerloginController.addData);
router.get('/showAll',registerloginController.findall);
router.post('/postData',registerloginController.posts);
router.delete('/postDelete/:id',registerloginController.deletePost);
router.put('/postUpdate/:id',registerloginController.updatePost);
//router.post('/post',registerloginController.post);
router.get('/joinData',registerloginController.joinTable)
router.delete('/delete/:id', registerloginController.delete);
router.put('/update/:id',registerloginController.update);
module.exports = router;
const jwt=require('jsonwebtoken')
const { JsonWebTokenError } = require("jsonwebtoken");
exports.verifytokenvalue=(req,res,next)=>{
const bearerheader=req.headers['authorization'];
if(typeof bearerheader !== 'undefined'){
    const bearer=bearerheader.split(" ");
    req.token=bearer[1];
    jwt.verify(req.token,'abcde',(err,authdata)=>{
        if(err){
            res.json({result:err})
        }
        else{
            next();
        }
    })
}
else{
  res.json({
      result:"Access denied 'unAuthrize user'"
  })  
}
}
var db = require('../config/config.db');
const bcrypt = require('bcrypt');
const multer = require('multer');
var jwt = require('jsonwebtoken');
//********// */
  //posts data
  const storage = multer.diskStorage({
    destination:function(req, file, cb) {
        cb(null,"./uploads");
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});
var upload = multer({storage : storage}).single("image");
exports.posts=(req, res)=> {
    upload(req, res, function(err){
        if(err)
        console.log(err.message);
        else
        {
            const user_id=req.body.user_id;
            const caption=req.headers.caption
            const filePath = req.file.filename;
            console.log('user_id',user_id)
            console.log('caption',caption)
            console.log(filePath)
            // var sql = "UPDATE users SET profile_picture = ? WHERE id = "+id
             var sql = "INSERT INTO posts (user_id,image,caption) VALUES ?"
            var values = [[user_id,filePath,caption]]
            db.query(sql ,[values],(err, results) => {
              if(err) 
              {
              res.status(400).json({
                status: "fails",
                err:err.message
              })}
              else{
                // console.log("Data Successfully Uploaded")
                res.status(200).json({
                  status:"file upload Successfully",
                  data: results
                })            
              }   
            })
         }
      })
  }
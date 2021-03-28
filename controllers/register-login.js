var db = require('../config/config.db');
const bcrypt = require('bcrypt');
const multer = require('multer');
var jwt = require('jsonwebtoken');

/***************All user view***************/
exports.findall = (req, res) => {
    db.query("Select *from users", (err,results) =>{
        if(err){
            return console.error(err.message);
        }
        res.status(200).json({
            success: true,
            message: "Successfully View your data",
            data:results
        });
    });
}


/************Registration call****************/
exports.register = (req, res, next) => {
    first_name = req.body.firstname;
    last_name = req.body.lastname;
    email = req.body.email;
    phone_number = req.body.phone;
    password = req.body.password;
    confirm_password = req.body.confirmPassword;
    /***********Check unique user************/ 
  var sql = "SELECT * FROM users WHERE email =?";
    db.query(sql, email, function (err, data, fields) {
      if (err) throw err;
      else if (data.length > 0) {
        res.status(400).json({
          success: false,
          status:402,
          message: "email was already exist",
        });
      }else if (confirm_password != password) {
        res.status(400).json({
          success: false,
          message: "Password & Confirm Password is not Matched",
        });
      } else {
     /***************Insert into database**************/ 
        bcrypt.hash(password, 10, function (err, hash) {
          if (err) throw err;
          else var sql = "INSERT INTO users (first_name,last_name,email,phone_number,password) VALUES ?";
          var values = [[first_name,last_name, email,phone_number, hash]];
          var token = jwt.sign({ _id:email},'abcde');
          db.query(sql, [values], function (err, data) {
            if (err) throw err;
            else {
              db.query(
                "SELECT * FROM users WHERE email = ?",
                [email],
                (err, results) => {
                  bcrypt.compare(password, results[0].password, (err, result) => {
                    if (!result) {
                      res.status(400).json({
                        status: false,
                        message: "Email and password does not match",
                        err: err,
                      });
                    } else {
                      res.status(200).json({
                        status: true,
                        message: "Successfully Login",
                        data: results,
                        token:token,
                      });
                    }
                  });
                }
              );
            }
          });
        });
      }
    });
  };



/*************Image upload*************/ 

const storage = multer.diskStorage({
    destination:function(req, file, cb) {
        cb(null,"./uploads");
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});
var upload = multer({storage : storage}).single("profile_picture");
exports.addData=(req, res)=> {
    //console.log("reg",req.headers)
    // if(!req.headers.authorization){
    //   res.json({
    //     status:false,
    //     message:"not Authorized"
    //   })
    // }
    upload(req, res, function(err){
        if(err)
        console.log(err.message);
        else
        {
            // const id = req.body.id;
            const filePath = req.file.filename;
            // var sql = "UPDATE users SET profile_picture = ? WHERE id = "+id
             var sql = "UPDATE users SET profile_pic = ? WHERE id = "+req.body.id
            var values = [[filePath]]
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


/**************Login functio call*****************/ 

module.exports.login=function(req,res){
  var email=req.body.email;
  var password=req.body.password;
  db.query('SELECT * FROM users WHERE email = ?',[email], function (error, results, fields) {
    if (error) {
        res.status(400).json({
          status:false,
          message:'there are some error with query',
          err:error
          })
        }
    else
     {
      if(results.length >0){
        bcrypt.compare(password, results[0].password, (err, result) => {
          if(!result){
            res.status(400).json({
              status:false,
              message: "password does not match",
              err:err
            });
          }else{
            res.status(200).json({
              status:true,
              message:"successfully login",
              data:results
            });
          }
        }) 
      }
      else{
        res.status(400).json({
            status:false,    
            message:"Email does not exits"
        });
      }
    }
  });
}

exports.delete = (req, res) => {
  let sql = "DELETE FROM users WHERE id=" + req.params.id;
  db.query(sql, (err, results) => {
    if (err) return console.log(err.message);
    else
      res.status(200).json({
        success: true,
        message: "success",
        data: results,
      });
  });
};


exports.update = (req, res) => {
  let sql ="UPDATE users SET first_name='" +req.body.firstname +"', last_name='"+req.body.lastname+
    "', email='" + req.body.email +"', phone_number ='"+req.body.phone+
    "' WHERE id=" + req.params.id;
  db.query(sql, (err, results) => {
    if (err) console.log(err);
    else
      res.status(200).json({
        success: true,
        message: "success",
        data: results,
      });
  });
};

  // *********//****/ */
  //jointable
  exports.joinTable=(req,res)=>{
    let sql ='select users.first_name,users.last_name,users.profile_pic,posts.id,posts.image,posts.caption from posts inner join users where posts.user_id=users.id' 
    db.query(sql,(err,result)=>{
      if(err){
        res.json({
          err:err
        })
      }
      else{
        res.status(200).json({
          sucess:true,
          message:'sucess',
          data:result
        })
      }
    })
  }
// Delete post
exports.deletePost = (req, res) => {
  let sql = "DELETE FROM posts WHERE id=" + req.params.id;
  db.query(sql, (err, results) => {
    if (err) return console.log(err.message);
    else
      res.status(200).json({
        success: true,
        message: "success",
        data: results,
      });
  });
};
//*** */
//post update
exports.updatePost = (req, res) => {
  let sql ="UPDATE posts SET caption='" +req.body.caption+"' WHERE id=" + req.params.id;;
  db.query(sql, (err, results) => {
    if (err) return console.log(err.message);
    else
      res.status(200).json({
        success: true,
        message: "success",
        data: results,
      });
  });
};


  //********// */
  //posts data
  
var upload = multer({storage : storage}).single("image");
exports.posts=(req, res)=> {
    upload(req, res, function(err){
        if(err)
        console.log(err.message);
        else
        {
            const user_id=req.body.user_id;
            const caption=req.body.caption
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

///***// */
//upload file on local folder
var upload = multer({storage : storage}).single("image");
exports.post=(req, res)=> {
    upload(req, res, function(err){
        if(err)
        console.log(err.message);
        else
        {
          const file=req.file
          console.log(file.filename)
          if(!file){
            console.log("error in file")
          }
          else{
            res.send(file)
          }
            // const user_id=req.body.user_id;
            // const caption=req.body.caption
            // const filePath = req.file.filename;
            // var sql = "UPDATE users SET profile_picture = ? WHERE id = "+id
            //  var sql = "INSERT INTO posts (user_id,image,caption) VALUES ?"
            // var values = [[user_id,filePath,caption]]
            // db.query(sql ,[values],(err, results) => {
            //   if(err) 
            //   {
            //   res.status(400).json({
            //     status: "fails",
            //     err:err.message
            //   })}
            //   else{
            //     // console.log("Data Successfully Uploaded")
            //     res.status(200).json({
            //       status:"file upload Successfully",
            //       data: results
            //     })            
            //   }   
            // })
         }
      })
  }
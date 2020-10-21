var express         = require("express"); 
var bodyParser      = require("body-parser"); 
var app             = express();
const router        = express.Router();
const mongoose      = require('mongoose');
var ObjectId        = require('mongodb').ObjectId;
var Image           = require('./models/image.js');
var User            = require('./models/User.js'); 
var Users           = require('./models/Users.js'); 
var multer          = require('multer')
var path            = require("path");
var bcrypt          = require('bcryptjs');
const jwt = require("jsonwebtoken");
const { check, validationResult,matchedData} = require('express-validator');
const webpush       = require('web-push');
var passport        = require('passport');
var passportFacebook= require('./auth/facebook');
var passportTwitter = require('./auth/twitter');
var passportGoogle  = require('./auth/google');
var passportGitHub  = require('./auth/github');
var passportInstagram = require('./auth/instagram');

mongoose.connect('mongodb://localhost:27017/mydb', { useNewUrlParser: true}); 
var db=mongoose.connection; 
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
  console.log("connection succeeded"); 
});

/* FACEBOOK ROUTER */
router.get('/auth/facebook',
  passportFacebook.authenticate('facebook'));

router.get('/auth/facebook/callback',
  passportFacebook.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/index');
  });

/* TWITTER ROUTER */
router.get('/auth/twitter',
  passportTwitter.authenticate('twitter'));

router.get('/auth/twitter/callback',
  passportTwitter.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

/* GOOGLE ROUTER */
router.get('/auth/google',
  passportGoogle.authenticate('google', { scope: 'https://www.googleapis.com/auth/userinfo.email' }));

router.get('/auth/google/callback',
  passportGoogle.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/index');
  }); 

/* GITHUB ROUTER */
router.get('/auth/github',
  passportGitHub.authenticate('github', { scope: [ 'user:email' ] }));

router.get('/auth/github/callback',
  passportGitHub.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/index');
  });
/* Instagram ROUTER */
app.get('/auth/instagram', passportInstagram.authenticate('instagram'));
app.get(
  '/auth/instagram/callback',
  passportInstagram.authenticate('instagram', {
    successRedirect: '/index',
    failureRedirect: '/login'
  })
);

//home page 
router.get('/index',function (req, res) {
  
  res.sendFile(path.join(__dirname+'/views/index.html'));

});

//GET login
router.get('/login',function (req, res) {
    res.sendFile(path.join(__dirname+'/views/login.html'));
});

//POST login page
router.post("/login",function (req, res){

   var email   =  req.body.email;
   var password= req.body.password;
   const mydata={
        'email'   : email,
        'password': password
  };
        
  Users.findOne(mydata, function(err,result){
     var passDateJson = {};
    console.log(result);
    if(err){
      passDateJson.status='fail';
      passDateJson.resType= 'Error';
      passDateJson.resMsg = 'Error occured, please try again.';
      passDateJson.err    = err;
      
    } else if(result!=null) {
  var token=jwt.sign({mydata}, 'my_secret_key', { expiresIn: '1h'}, {algorithm: "HS256"});
  console.log("token:",token);
  req.session.user = result.email;
  req.session.userid = result._id;
  // req.session.token=token;
  // req.session.sessionkey = result.id;
  
      passDateJson.status  ='success';
      passDateJson.resType = 'Success';
      passDateJson.resMsg  = 'login succes.';
    }else{
      passDateJson.status  = 'empty';
      passDateJson.message = 'Invalid Input';
    }
    res.json(passDateJson);
    });
  });

//logout
router.get('/logout',function(req,res){
  delete req.session.userid;
  res.sendFile(path.join(__dirname+'/views/login.html'));
});

//GET register
router.get('/register',function (req, res) {
  res.sendFile(path.join(__dirname+'/views/register.html'));
});
//post register
router.post('/register',function(req,res){ 

  var name = req.body.name; 
  var email= req.body.email; 
  var pass = req.body.password; 
  var phone=req.body.phone; 
  
  var data = { 
    "name": name, 
    "email":email, 
    "password":pass, 
    "phone":phone
  } 
  
new Users({
    name    : req.body.name,
    email   : req.body.email,
    password: req.body.password,
    phone   : req.body.phone
  }).save(function(err, doc){
    var passDateJson = {};   
    if(err){
      passDateJson.resType='error';
      passDateJson.resMsg ='Error occured';
      passDateJson.err    = err;
    }else{
      passDateJson.resType='success';
      passDateJson.resMsg ='Record deleted Successfully';
  
    }
res.json(passDateJson);

  });

}); 
//GET userdetails
router.get('/userdetails',function (req, res) {
  var result;
  Users.find({},function(err,result){
  // res.render('pages/userdetails',{result:result});
   res.sendFile(path.join(__dirname+'/views/pages/userdetails.html'),{result:result});
});
});

//POST userdetails
router.post('/userdetails',function (req, res) {
  var name = req.body.name; 
  var email =req.body.email; 
  var pass = req.body.password; 
  var phone =req.body.phone; 
  
  var data = { 
    "name": name, 
    "email":email, 
    "password":pass, 
    "phone":phone
  } 
  
new Users({
    name    : req.body.name,
    email   : req.body.email,
    password: req.body.password,
    phone   : req.body.phone
  }).save(function(err, doc){
    var passDateJson = {};   
    if(err){
      passDateJson.resType='error';
      passDateJson.resMsg ='Error occured';
      passDateJson.err    = err;
    }else{
      passDateJson.resType='success';
      passDateJson.resMsg ='Record deleted Successfully';
  
    }
res.json(passDateJson);

  });

});
//GET userdetails
router.get('/productdetails',function (req, res) {
  var result;
  Users.find({},function(err,result){
  // res.render('pages/userdetails',{result:result});
   res.sendFile(path.join(__dirname+'/views/pages/productdetails.html'),{result:result});
});
});

//POST userdetails
router.post('/productdetails',function (req, res) {
  var name = req.body.name; 
  var email =req.body.email; 
  var pass = req.body.password; 
  var phone =req.body.phone; 
  
  var data = { 
    "name": name, 
    "email":email, 
    "password":pass, 
    "phone":phone
  } 
  
new Users({
    name    : req.body.name,
    email   : req.body.email,
    password: req.body.password,
    phone   : req.body.phone
  }).save(function(err, doc){
    var passDateJson = {};   
    if(err){
      passDateJson.resType='error';
      passDateJson.resMsg ='Error occured';
      passDateJson.err    = err;
    }else{
      passDateJson.resType='success';
      passDateJson.resMsg ='Record deleted Successfully';
  
    }
res.json(passDateJson);

  });

});
router.get('/product',function (req, res) {
  var result;
 Image.find({},function(e,result){
        res.render('pages/product', {
            "result" : result
        });
    });
});
module.exports=router;

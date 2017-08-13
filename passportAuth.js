var express = require('express');
var passport = require('passport');
var Startegy = require('passport-facebook').Startegy ;

passport.use( new Startegy({
	clientID: '1807453979283640' ,
	clientSecret:'e7f5164314bdf36191c71e16b33efcb3',
	callbackURL :'http://localhost:8080/users/login/facebook/return'
} ,
function (accessToken , refreshToken , profile , cb){
    console.log("accessToken"+accessToken);
    console.log("refreshToken"+refreshToken);
    console.log("profile"+profile);
    console.log("cb"+cb);
    return cb(null , profile);
} ));

passport.serializeUser(function(user, cb){
	console.log(user);
	cb(null , user);
})

passport.deserializeUser(function(obj, cb){
	console.log(obj);
	cb(null , obj);
})

var app =express();

app.set('views' , __dirname + '/views');
	app.set('view engine', 'ejs');

	app.use(require('morgan')('combined'))
	app.use(require('cookie-parser')())
	app.use(require('body-parser').urlencoded({extended:true}));
	app.use(require('express-session')({secret:' node app', resave: true , httpOnly:true ,
	    proxy: true,
		saveUnintialized:true,
		cookie:{secure:false}
	 }))

	app.use(passport.initialize());
	app.use(passport.session());







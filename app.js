var express=require('express');
var app = express();
var mongoose=require('mongoose');
var session = require('express-session'); // module for maintaining the sessions
var logger = require('morgan'); // morgan does sends the logs means , if we get any exception it'll send to log with Status code.
var bodyParser= require('body-parser');
var cookieParser= require('cookie-parser');
//path is used to get the our file paths
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.use(logger('dev')); // dev means it's on development 
app.use(bodyParser.json({limit:'10mb', extended:true}));
app.use(bodyParser.urlencoded({limit:'10mb',extended:true}));
app.use(cookieParser());

//session for Login/SignUp
app.use(session({
	name:'cokkieNode',
	secret: 'node oath',
	resave:true ,
	httpOnly:true ,
    proxy: true,
	saveUnintialized:true,
	cookie:{secure:false}
}))

//mongo db connection URI
var dbPath= "mongodb://localhost/cartdb";
//mongoose promese
mongoose.Promise = global.Promise;
// Database connenction with data base Status.
dbconnect=mongoose.connect(dbPath);
//Whence database hitted to connection , log message will be display
mongoose.connection.once('connected', function() {
	console.log("Connected to database");
});



// var passport=require('passport');
// var passportLocal=require('passport-local');



var passport = require('passport');
var Strategy = require('passport-facebook').Strategy ;

passport.use( new Strategy({
	clientID: '2893453973383640' ,
	clientSecret:'e1f5264324bdf36141c71e16eeefcb3',
	callbackURL :'http://localhost:8080/users/login/facebook/return'
} ,
function (accessToken , refreshToken , profile , cb){
    console.log("accessToken"+accessToken);
    console.log("refreshToken"+refreshToken);
    console.log("profile"+profile);
    console.log("cb"+cb);
    console.log("cb"+profile);
    return cb(null , profile);
} ));

passport.serializeUser(function(user, cb){
	console.log("+++++++++++++++++user+++++++++++++++++++++++");
	console.log(user);
	console.log("+++++++++++++++++user+++++++++++++++++++++++");

	cb(null , user);
})

passport.deserializeUser(function(obj, cb){
	console.log(obj);
	cb(null , obj);
})
//Template engine views path
app.set('views', path.join(__dirname + '/views'));
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

//seting the template engine
app.set('views', __dirname + '/views');
app.set('view engine','pug')


//Index page is the welcome page.
app.get('/',function(req,res){
    
    var sessionCheck= req.session.user;
    console.log(req.session.user)
    if(sessionCheck){
	console.log("Welocome TO Carts World!!!")
	res.redirect('/users/products/');
    }else{
    	res.sendFile(__dirname+'/index.html');
	console.log("session out!!!")
    }
	
});

app.get('/users/login/facebook' , passport.authenticate('facebook'));

app.get('/users/login/facebook/return' , passport.authenticate('facebook' , {failureRedirect: '/users/login'}), 
	function(req,res ,user){
		console.log("Name---" +req.name+"ID:-"+req.id+""+ req.user)
		res.redirect('/users/login/facebook/profile')

	});
app.get('/users/login/facebook/profile' , require('connect-ensure-login').ensureLoggedIn(), 
	function(req,res){
		res.send(res)
		console.log("Name---" +res.displayName+"ID:-"+req.id+"")
		res.render('./../views/dashboard' , {user: req.user});
	})


//fs module is a default module for file mangement system
var fs = require('fs');
fs.readdirSync('./models').forEach(function(file){
	if(file.indexOf('.js'))
		require('./models/'+file);
});

fs.readdirSync('./controller').forEach(function(file){
	if(file.indexOf('.js'))
		var route = require('./controller/'+file);
	route.controllerFunction(app);
});
fs.readdirSync('./admin').forEach(function(file){
	if(file.indexOf('.js'))
		var route = require('./admin/'+file);
	route.admincontrollerFunction(app);
});

//using authentication
// var auth = require('./lib/auth');
var userModel = mongoose.model('User')
//setting middlewaare
app.use(function(req,res,next){

	if(req.session && req.session.user){
		userModel.findOne({'email':req.session.user.email},function(err,user){

			if(user){
				// req.user = user;
				delete req.user.password; 
				req.session.user = user;
				next()
			}
			else{
				console.log("user condition failed")
			}
		});
	}
	else{
		next();
	}


});



app.use(function(err, req , res, next){
console.log("Routing error!")
res.status(err.Status || 500);
res.render('./error',{
	message: err.message,
	error:err
})
});

app.listen(8080,function(){
	console.log("Cart-Server-Is-Up");
});
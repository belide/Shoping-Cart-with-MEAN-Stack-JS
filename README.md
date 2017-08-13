# Shoping-Cart-with-MEAN-Stack-JS
Hi all , Today I'm Going to make Shoping Cart by Using MEAN stack Technology  First Things Do:  1). Install Node and Mongodb on respective projects  2). Create a package json with name package.json , the keep package.json code into there and run commond promt with "npm install"  now you can ready make changes .
Now we've to make model for connecting the mongoDb , these files located in "models" folder
For Examples:- this code for adminCart , we've another model also that's for actual Cart

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var adminSchema = new Schema({
	itemImage		: {type:String,required:true},
	itemName 		: {type:String,required:true},
	itemContent 	: {type:String,required:true}
	});

mongoose.model('adminModel',adminSchema);

Then we're going to make Controllers for adminCart and actual Cart , for these files goes to Controllers folder
and same like refer views folder for all pages , and now we're ready to deploy 
1) Goes to commond promnt run mondoDb with "mongod"
here open connection for allowing models to save here
2) and take new commond promnt then run node app with "node app.js"
here our server will be started with port "8080"


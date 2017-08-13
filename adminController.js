var mongoose = require('mongoose');
var express = require('express');
var app = express();
app.set('view engine', 'ejs');
//express routes are used to difene routes 
var userRouter  = express.Router();
var adminModel = mongoose.model('adminModel');

// using lib for all responseGenerator  messages 
var responseGenerator = require('./../lib/responseGenerator');
console.log(responseGenerator);

//using authentication
// var auth = require('./../lib/auth');
// console.log("auth"+auth)
//Creating Signup function
module.exports.admincontrollerFunction = function(app){

app.engine('html', require('ejs').renderFile);

userRouter.get('/adminCreate',function(req,res){
    console.log("Please create admin items!!")
    res.render('adminCreate.html' , {root: './views'});
});
userRouter.get('/adminlogin',function(req,res){
    console.log("login INTO adminlogin!!")
    res.render('adminlogin.html' , {root: './views'});
});
userRouter.get('/adminAllItems',function(req,res){
    console.log("adminAllItems!!")
    adminModel.find(function(err, result){
        if(err){
            console.log("error-"+req.params.id)
            res.send(err)
        }else{
            // var itemName = JSON.stringify(result);
              console.log('=======================================');
            console.log(result[0].itemName);
            console.log('=======================================');
            res.render('./../views/showitems.html',{
            result:result
        })
        }
    // res.render('adminAllItems.html' , {root: './views'} );
    })
});
userRouter.get('/adminUpdate',function(req,res){
    console.log("adminUpdate!!")
    res.render('adminUpdate.html' , {root: './views'});
});
userRouter.get('/adminDelete',function(req,res){
    console.log("adminDelete!!")
    res.render('adminDelete.html' , {root: './views'});
});

userRouter.get('/users/adminUpdate/:id',function(req,res){
    res.redirect('/users/adminAllItems');
});

userRouter.get('/users/adminDelete/:id',function(req,res){
    res.redirect('/users/adminAllItems');
});


app.post('/users/adminDelete/:id',function(req, res) {

    adminModel.remove({'_id':req.params.id},function(err,result){

            console.log("delete-error"+req.params.id);
        if(err){
            res.send(err)
        }
        else{
          
            res.render('./../views/showItems',{
            result:  "Delted value is -"+result
        })
        }

    }); 
  
});

app.post('/users/adminUpdate/:id',function(req, res) {
        var updateAction = req.body;
    adminModel.findByIdAndUpdate({'_id':req.params.id}, updateAction , function(err, result){
        if(err){
            console.log("error-"+req.params.id)
            res.send(err)
        }else{
           res.render('./../views/showItems',{
            result:"Updated value is - "+result
        })
        }

    })
  });



    app.post('/users/adminlogin', function(req,res){
            console.log("login post")
            if(req.body.email == "admin@gmail.com" || req.body.password == "admin" ){
                var myResponse = responseGenerator.generate(true , "User Not Found! , Please use valid credentials", 404, null);
                res.redirect('/users/adminCreate')
                          }else{
                var myResponse ={
        error:true,
        message:"Please Give a Valid credentials",
        status:500,
        data:null
    };
              res.render('./../views/error',{
            message:myResponse.message ,
            error:myResponse.data
        })
          }
    });

    app.post('/users/adminCreate',function(req, res) {

        console.log("creating-Item-here")
        var newItem = new adminModel({
            itemName       : req.body.itemName,
            itemImage     : req.body.itemImage,
            itemContent     : req.body.itemContent

        }); 

        var allTags = (req.body.allTags!=undefined && req.body.allTags!=null)?req.body.allTags.split(','):''
        newItem.tags = allTags;
        newItem.save(function(error){
            if(error){
                console.log(error);
                res.send(error);
            }
            else{
                console.log(newItem);
                res.send(newItem);
            }

        }); 
      
    });

    app.use('/users' , userRouter);
}





















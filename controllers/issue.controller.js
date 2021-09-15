const Issue = require("../models/Issue.js");

// Create and Save a new Issue
exports.createIssue = (req, res) => {
     Issue.createIssue(req.body, (err, data) =>{
        if(err){
            res.send({message:err});
        }else{
            res.send({message:data});
        }
    })
  
};


//Update status
exports.changeStatus = (req, res) => {
    Issue.changeStatus(req.body, (err, data) =>{
       if(err){
           res.send({message:err});
       }else{
           res.send({message:data});
       }
   })
 
};

//Get Issues
exports.getIssues = (req, res) => {
    Issue.getIssues(req.body, (err, data) =>{
       if(err){
           res.send({message:err});
       }else{
           res.send({message:data});
       }
   })
 
};

//Get Issues
exports.upvoteIssue = (req, res) => {
    Issue.upvoteIssue(req.body, (err, data) =>{
       if(err){
           res.send({message:err});
       }else{
           res.send({message:data});
       }
   })
 
};
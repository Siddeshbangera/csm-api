const sql = require("../dbms/db.js");
const User = require("../models/User.js");
const multer = require('multer');



// constructor
const Issue = function(Issue) {
  this.pincode = Issue.pincode;
  this.lat = Issue.lat;
  this.long = Issue.long;
  this.addressOne = Issue.addressOne;
  this.addressTwo = Issue.addressTwo;
  this.imageOne = Issue.imageOne;
  this.description = Issue.description;
  this.id = Issue.id;
};

Issue.createIssue = (newIssue, result) => {
  let pincode = newIssue.pincode;
  let lat = newIssue.lat;
  let long = newIssue.long;
  let addressOne = newIssue.addressOne;
  let addressTwo = newIssue.addressTwo;
  let imageOne = newIssue.imageOne;
  let description = newIssue.description;
  let userId = "";
  let issuestatus= "In Progess";
  User.authenticateJWT(newIssue.jwt)
  .then(user => {
    if(user){
      userId = user.id;
      userId = userId.toString();

      sql.query("SELECT `issue_id` FROM `issue_tb` where `pincode` = " + "'" + newIssue.pincode + "' AND status = 'In Progress'", (err, res) =>{
        if(err){
          result(null, {message:"Fecth Issue Error"});
          return;
        }


        if(res){
          console.log(res);

          if(res.length && res.length > 0){
            result(null, {message:"Issue Existed", data:res});
            return;
          }

          sql.query("INSERT INTO `issue_tb` (`id`, `pincode`, `lat`, `long`,`add1`,`add2`,`image1`,`image3`,`image2`,`status`,`isActive`, `description`) VALUES ?",
          [[[userId,pincode,lat,long,addressOne,addressTwo,imageOne,"","",issuestatus,"1",description]]],
          (err, res) => {
            if (err) {
              console.log("error: ", err);
              result(null, {message:"Something went wrong"});
              return;
            }
        
            console.log("created Issue: ", { id: res.insertId, ...newIssue });
            result(null, {message:"Issue Created"});
          });
        }else{
          console.log(res);
        }
      });
    }else{
      result(null, {message:"User Not Valid"});
      return;
    }
  });
};

Issue.changeStatus = (statusObj, result) => {
  let status = statusObj.status;
  let id = statusObj.id;
  let jwt = statusObj.jwt;
  
  User.authenticateJWT(jwt)
  .then(user => {
    if(user){
      userId = user.id;
      userId = userId.toString();

      if(status !== "Delete"){
        sql.query("UPDATE `issue_tb` SET `status` = '" + status + "' WHERE `issue_id` = '" + id + "'" , (err, res) =>{
          if(err){
            result(null, {message:"Update Status Error"});
            return;
          }
  
  
          if(res){
            console.log(res);
            result(null, {message:"Status Updated Success"});
            return;
            
          }else{
            console.log(res);
          }
        });
      }else{
        sql.query("DELETE FROM `issue_tb` WHERE `issue_id` = '" + id + "'" , (err, res) =>{
          if(err){
            result(null, {message:"Update Status Error"});
            return;
          }
  
  
          if(res){
            console.log(res);
            result(null, {message:"Deleted Issue Success"});
            return;
            
          }else{
            console.log(res);
          }
        });
      }

      
    }else{
      result(null, {message:"User Not Valid"});
      return;
    }
  });
};

Issue.getIssues = (statusObj, result) => {
  let status = statusObj.status;
  let jwt = statusObj.jwt;
  
  User.authenticateJWT(jwt)
  .then(user => {
    if(user){
      userId = user.id;
      userId = userId.toString();

      if(status === "Recent"){
        let userIssues = [];
        let allIssues = [];
        let upvoteCounts = [];

        let userIssueCompleted = false;
        let allIssuesCompleted = false;
        let upvoteCountsCompleted = false;

        sql.query("SELECT * FROM `issue_tb` ", (err, res) =>{
          if(err){
            allIssuesCompleted = true;

            if(userIssueCompleted && allIssuesCompleted && upvoteCountsCompleted){
              result(null, {message:"Get List Error"});
              return;
            }
            
          }

          if(res){
            console.log(res);
            allIssuesCompleted = true;
            if(userIssueCompleted && allIssuesCompleted && upvoteCountsCompleted){
              allIssues = res;
              result(null, {message:"List Success",data:{userIssues:userIssues,upvoteCounts:upvoteCounts,allIssues:allIssues,id:userId}});
              return;
            }else{
              allIssues = res;
              return;
            }
          }
        });

        sql.query("SELECT `issue_id`, count(id) AS count FROM `upvote_tb` group by `issue_id`",(err,upvoteRes) => {
          if(err){
            upvoteCountsCompleted = true;

            if(userIssueCompleted && allIssuesCompleted && upvoteCountsCompleted){
              result(null, {message:"Get List Error"});
              return;
            }
            
          }

          if(upvoteRes){
            console.log(upvoteRes);
            upvoteCountsCompleted = true;
            if(userIssueCompleted && allIssuesCompleted && upvoteCountsCompleted){
              upvoteCounts = upvoteRes;
              result(null, {message:"List Success",data:{userIssues:userIssues,upvoteCounts:upvoteCounts,allIssues:allIssues,id:userId}});
              return;
            }else{
              upvoteCounts = upvoteRes;
              return;
            }
          }
        });

        sql.query("SELECT `issue_id` FROM `upvote_tb` WHERE  `id` = '" + userId + "'",(err,userRes) => {
          if(err){
            userIssueCompleted = true;

            if(userIssueCompleted && allIssuesCompleted && upvoteCountsCompleted){
              result(null, {message:"Get List Error"});
              return;
            }
            
          }

          if(userRes){
            console.log(userRes);
            userIssueCompleted = true;
            if(userIssueCompleted && allIssuesCompleted && upvoteCountsCompleted){
              userIssues = userRes;
              result(null, {message:"List Success",data:{userIssues:userIssues,upvoteCounts:upvoteCounts,allIssues:allIssues,id:userId}});
              return;
            }else{
              userIssues = userRes;
              return;
            }
          }

        });
      }else{
        sql.query("SELECT * FROM `issue_tb` WHERE `id` = '" + userId + "'" , (err, res) =>{
          if(err){
            result(null, {message:"Get List Error"});
            return;
          }
  
          if(res){
            sql.query("SELECT `issue_id`, count(id) AS count FROM `upvote_tb` group by `issue_id`",(err,upvoteRes) => {
              if(err){
                result(null, {message:"Get List Error"});
                return;
              }
    
              if(upvoteRes){
                console.log(upvoteRes);
                result(null, {message:"List Success",data:{userIssues:[],upvoteCounts:upvoteRes,allIssues:res,id:userId}});
                return;
              }
            });
          }
        });
      }

      
    }else{
      sql.query("SELECT * FROM `issue_tb` ", (err, res) =>{
        if(err){
          result(null, {message:"Get List Error"});
          return;
        }

        
        if(res){
          sql.query("SELECT `issue_id`, count(id) AS count FROM `upvote_tb` group by `issue_id`",(err,upvoteRes) => {
            if(err){
              result(null, {message:"Get List Error"});
              return;
            }
  
            if(upvoteRes){
              console.log(upvoteRes);
              result(null, {message:"List Success",data:{userIssues:[],upvoteCounts:upvoteRes,allIssues:res,id:""}});
              return;
            }
          });
        }
      });
    }
  });
};

Issue.upvoteIssue = (statusObj, result) => {
  let issueId = statusObj.issue_id;
  let jwt = statusObj.jwt;
  
  User.authenticateJWT(jwt)
  .then(user => {
    if(user){
      userId = user.id;
      userId = userId.toString();
    
      sql.query("INSERT INTO `upvote_tb` (`id`, `issue_id`) VALUES ?",[[[userId, issueId]]], (err, res) =>{
        if(err){
          result(null, {message:"Get List Error"});
          return;
        }

        if(res){
          console.log(res);
          result(null, {message:"Upvote Success"});
          return;
          
        }else{
          console.log(res);
        }
      });
    }else{
      result(null, {message:"User Not Valid"});
      return;
    }
  });
};

module.exports = Issue;

const User = require("../models/User.js");

// Create and Save a new User
exports.createUser = (req, res) => {
    User.createUser(req.body.email,req.body.password, (err, data) =>{
        if(err){
            res.send({message:"Not Found"});
        }else{
            res.send(data);
        }
    })
};

// AuthenticateUser
exports.authenticate = (req, res) => {
    User.authenticateUser(req.body.email, req.body.password, (err, data) =>{
        if(err){
            res.send({message:err});
        }else{
            res.send({message:data});
        }
    })
};

// Find a single User with a UserId
exports.findOne = (req, res) => {
    User.findById(req.params.userId, (err, data) =>{
        if(err){
            res.send({message:"Not Found"});
        }else{
            res.send(data);
        }
    })
};

// Update a User identified by the UserId in the request
exports.updateUser = (req, res) => {
    User.updateUser(req.body, (err, data) =>{
        if(err){
            res.send({message:"Not Found"});
        }else{
            res.send(data);
        }
    })
};

// Delete a User with the specified UserId in the request
exports.deleteUser = (req, res) => {
    User.deleteUser(req.body, (err, data) =>{
        if(err){
            res.send({message:"Not Found"});
        }else{
            res.send(data);
        }
    })
};
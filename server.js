require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const {v4 : uuidv4} = require('uuid');
const multer = require('multer');
const mime = require('mime-types')

//app.use(express.json());

const Dashboard = require("./models/Dashboard.js");
const User = require("./models/User.js");

const app = express();

// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Function to serve all static files
// inside public directory.
app.use(express.static('public'));  
app.use('/images', express.static('images')); 

const storage = multer.diskStorage({
    destination(req, file, callback) {
      callback(null, './images');
    },
    filename(req, file, callback) {
      callback(null, uuidv4()+"."+mime.extension(file.mimetype));
    },
  });
  
const uploadFile = multer({ storage });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to cms application." });
});


// dashboard
app.get("/dashboard", (request, response) => {
    Dashboard.getDashboard((err,data) => {
        if(err){
            response.status(500).send({
                message:err.message || "no data found"
            });
        }else{
            response.send(data);
        }
    });
    //res.json({ message: "Welcome to cms application." });
});

// create user
app.get("/createUser", (request, response) => {
  User.create((err,data) => {
      if(err){
          response.status(500).send({
              message:err.message || "no data found"
          });
      }else{
          response.send(data);
      }
  });
  //res.json({ message: "Welcome to cms application." });
});

app.post('/uploadImage', uploadFile.array('photo', 3), (req, res) => {
    res.status(200).json({
      message: 'success',
      filename:req.files[0].filename
    });
  });

require("./routes/user.routes.js")(app);
require("./routes/issue.route.js")(app);

// set port, listen for requests
app.listen(3003, () => {
  console.log("Server is running on port 3003.");
});
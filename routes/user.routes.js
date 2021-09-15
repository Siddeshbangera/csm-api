
module.exports = app => {
    const users = require("../controllers/user.controller.js");
  
    // Create a new User
    app.post("/createUser", users.createUser);

    app.post("/authenticateUser", users.authenticate);
  
    // Retrieve all Users
    app.post("/updateUser", users.updateUser);
  
    // Update a User with userId
    app.post("/deleteUser", users.deleteUser);
  };
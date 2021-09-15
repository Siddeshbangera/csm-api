const sql = require("../dbms/db.js");
const jwt = require("jsonwebtoken");

// constructor
const User = function(User) {
  this.email = User.email;
  this.password = User.password;
  this.isActive = User.isActive;
  this.isAdmin = User.isAdmin;
};

User.createUser = (email, password, result) => {

  sql.query("SELECT `id` FROM `user_tb` WHERE `email` = '"+ email + "'", (err,res) => {
    if(err){
      console.log("error: ", err);
      result(null, {message:"something went wrong"});
      return;
    }

    if(res && res.length > 0){
      result(null, {message:"user exists"});
      return;
    }else{
      sql.query("INSERT INTO `user_tb` (`email`, `password`, `isActive`, `isAdmin`) VALUES ?", [[[email, password, "1", "0"]]], (err, res) => {
        if (err) {
          result(null, {message:"something went wrong"});
          return;
        }

        if(res){
          sql.query(`SELECT * FROM user_tb WHERE email = ?`,[email], (err, res) => {
            if (err) {
              result(null, {message:"data exist"});
              return;
            }
    
            let newToken = jwt.sign(JSON.parse(JSON.stringify(res[0])), process.env.ACCESS_TOKEN);
            result(null, {message:"create success", data:res[0],jwt:newToken});
          });
        }
      });
    }
  });
  
};

User.findById = (UserId, result) => {
  sql.query(`SELECT * FROM user_tb WHERE id = ${UserId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found User: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found User with the id
    result({ kind: "not_found" }, null);
  });
};

User.getAll = result => {
  sql.query("SELECT * FROM user_tb", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Users: ", res);
    result(null, res);
  });
};

User.updateById = (id, User, result) => {
  sql.query(
    "UPDATE user_tb SET email = ?, password = ?, isActive = ?, isAdmin = ? WHERE id = ?",
    [User.email, User.password, User.isActive,, User.isAdmin, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      if (res.affectedRows == 0) {
        // not found User with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated User: ", { id: id, ...User });
      result(null, { id: id, ...User });
    }
  );
};

User.remove = (id, result) => {
  sql.query("DELETE FROM user_tb WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found User with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted User with id: ", id);
    result(null, res);
  });
};

User.removeAll = result => {
  sql.query("DELETE FROM user_tb", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log(`deleted ${res.affectedRows} Users`);
    result(null, res);
  });
};

User.authenticateUser = (email, password, result) => {
  try{
    sql.query(`SELECT * FROM user_tb WHERE email = ?`,[email], (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        sql.query(`SELECT * FROM user_tb WHERE email = ? and password = ?`,[email, password], (err, res) => {
          if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
          }
      
          if (res.length) {
            console.log("found User: ", res[0]);
            let newToken = jwt.sign(JSON.parse(JSON.stringify(res[0])), process.env.ACCESS_TOKEN);
            result(null, {data:res[0],jwt:newToken});
            return;
          }
      
          // password wrong
          result({ kind: "Wrong Password" }, null);
        });
        return;
      }
  
      // not found User with the id
      result({ kind: "Not Found"}, null);
    });
  }catch(e){
    result({ kind: "Something went wrong" },null);
  }
};

User.authenticateJWT = (token) => {
  return new Promise((resolve,reject)=>{
    jwt.verify(token,
    process.env.ACCESS_TOKEN,
     (err,user)=>{
    if(err){ 
      resolve(false)
    }else{
     resolve(user);
    }
  })})
}

module.exports = User;
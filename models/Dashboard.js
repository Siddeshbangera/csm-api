const sql = require("../dbms/db.js");

// constructor
const Dashboard = function(Dashboard) {
  this.inProgress = Dashboard.inProgress;
  this.resolved = Dashboard.resolved;
  this.newlyCreated = Dashboard.newlyCreated;
  this.onHold = Dashboard.onHold;
  this.total = Dashboard.total;
};


Dashboard.getDashboard = result => {
    sql.query("SELECT * FROM dashboard_db", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      console.log("Dashboard: ", res);
      result(null, res);
    });
  };

  module.exports = Dashboard;
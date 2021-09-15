
module.exports = app => {
    const issue = require("../controllers/issue.controller.js");
    
    app.post("/createIssue", issue.createIssue);
    
    app.post("/changeStatus", issue.changeStatus);

    app.post("/getIssues", issue.getIssues);

    app.post("/upvoteIssue", issue.upvoteIssue);

  };
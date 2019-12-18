const express = require("express");
const bodyParser = require("body-parser");
var mongoDB = require("mongoose");
var cors = require("cors");
const server = express();
const { Data } = require("./loginValidation");

server.use(bodyParser.json());
server.use(cors());

mongoDB.connect("mongodb://localhost:27017/rishi", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

server.post("/login", function(req, res) {
  console.log("data received:",req.body);
  var validateData = new Data(req.body);
  var query = {
    emailId: validateData.emailId,
    password: validateData.password
  };

  Data.findOne(query)
    .then(function(data) {
      if (data !== null) {
        console.log('welcome ${validateData.emailId}');
        res.send(true);
      } else {
        console.log("Invalid credentials");
        res.send(false);
      }
    })
    .catch(function(err) {
      console.log('${validateData.emailId} not found');
      res.status(500).json({
        message: "error"
      });
    });
});

server.get("/tests/:id", function(req, res) {
  console.log(req.params.id);
  res.send(req.params.id);
});
server.listen(8080);

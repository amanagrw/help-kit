const express = require("express");
const _ = require("lodash");
const bodyParser = require("body-parser");
const { ObjectID } = require("mongodb");

var { mongoose } = require("./db/mongoose");
var { User } = require("./models/user");

var app = express();

app.use(bodyParser.json());

app.post("/users", (req, res) => {
  var body = _.pick(req.body, [
    "name",
    "sex",
    "age",
    "phoneno",
    "email",
    "password"
  ]);
  var user = new User(body);

  user
    .save()
    .then(user => {
      res.send(user);
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

app.post("/users/login", (req, res) => {
  var body = _.pick(req.body, ["email", "password"]);

  res.send(body); //just like that
});

app.listen(3000);

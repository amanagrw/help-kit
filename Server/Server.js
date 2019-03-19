const express = require("express");
const _ = require("lodash");
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("./config/config");
const { ObjectID } = require("mongodb");
const passport = require("passport");

var { mongoose } = require("./db/mongoose");
var { User } = require("./models/user");
var { Group } = require("./models/group");

var app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/auth", require("./routes/auth"));
app.use("/", require("./routes/index"));

//Create group
app.post("/groups", (req, res) => {
  var body = _.pick(req.body, [
    "name",
    "description",
    "address",
    "city",
    "age",
    "diseases",
    "interests",
    "time"
  ]);
  var group = new Group(body);

  group
    .save()
    .then(group => {
      res.send(group);
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

//RETURN all groups
app.get("/groups/all", (req, res) => {
  Group.find().then(
    groups => {
      res.send({ groups });
    },
    e => {
      res.status(400).send(e);
    }
  );
});

//RETURN group by id
app.get("/group/:id", (req, res) => {
  var id = req.params.id;
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Group.findById(id)
    .then(group => {
      if (!group) {
        return res.status(404).send();
      }
      res.send({ group });
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

//Join an existing group
app.get(
  "/group/join/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    Group.findById(id)
      .then(group => {
        group.members.forEach(memberId => {
          if (memberId.equals(req.user._id)) {
            return res.send("user already a member");
          }
        });
        group.members.push(req.user._id);
        group.save().then(group => {
          req.user.groups.push(group._id);
          req.user.save().then(user => {
            res.send(user.groups);
          });
        });
      })
      .catch(e => res.status(400).send(e));
  }
);

app.listen(3000);

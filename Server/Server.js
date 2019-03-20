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

//Create group and store creator in createdBy
app.post(
  "/group/create",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
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
    body.createdBy = req.user._id;
    var group = new Group(body);

    group
      .save()
      .then(group => {
        res.send(group);
      })
      .catch(e => {
        res.status(400).send(e);
      });
  }
);

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
  async (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }
    try {
      let group = await Group.findById(id);
      let isMember = group.members.some(memberId =>
        memberId.equals(req.user._id)
      );
      if (isMember) {
        return res.send("user already a member");
      }
      group.members.push(req.user._id);
      group.save().then(group => {
        req.user.groups.push(group._id);
        req.user.save().then(user => {
          res.send(user.groups);
        });
      });
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

//Leave an existing group
app.get(
  "/group/leave/:id",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }
    try {
      let group = await Group.findById(id);
      let isMember = group.members.some(memberId =>
        memberId.equals(req.user._id)
      );
      if (!isMember) {
        return res.send("user not a member");
      }
      group.members.pop(req.user._id);
      group.save().then(group => {
        req.user.groups.pop(group._id);
        req.user.save().then(user => {
          res.send(user.groups);
        });
      });
    } catch (e) {
      res.status(400).send(e);
    }
  }
);

//Return my groups - works fine
app.get(
  "/mygroups",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    req.user.groups.forEach(memberId => {
      if (!memberId) {
        return res.status(404).send();
      }
      Group.findById(memberId)
        .then(group => {
          res.send({ group });
        })
        .catch(e => {
          res.status(400).send(e);
        });
    });
  }
);

//Return my groups - not working on this route path
// app.get(
//   "/group/my",
//   passport.authenticate("jwt", { session: false }),
//   (req, res) => {
//     console.log("olppopokok");
//     req.user.groups
//       .forEach(memberId => {
//         if (!memberId) {
//           console.log("inside");
//           return res.status(404).send();
//         }
//         console.log("Outside");
//         Group.findById(memberId).then(group => {
//           console.log(group);
//           res.send({ group });
//         });
//       })
//       .catch(e => {
//         res.status(400).send(e);
//       });
//   }
// );

//Delete group by id
app.delete(
  "/group/delete/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    var id = req.params.id;
    if (!ObjectID.isValid(id)) {
      return res.status(404).send();
    }

    Group.findByIdAndRemove(id)
      .then(group => {
        if (!group) {
          return res.status(404).send();
        } else if (group.createdBy.equals(req.user.id)) {
          req.user.groups.pop(id);
          req.user.save();
          res.send(req.user.groups);
        } else {
          return Promise.reject();
        }
      })
      .catch(e => {
        res.status(400).send(e);
      });
  }
);

//Return query-based groups
app.get("/groupt/filter", (req, res) => {
  res.send(req.query);
});

app.listen(3000);

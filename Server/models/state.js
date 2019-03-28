const mongoose = require("mongoose");

var stateSchema = new mongoose.Schema({
  stateId: {
    type: Number,
    required: true
  },
  value: {
    type: String,
    required: true
  }
});

var State = mongoose.model("States", stateSchema);

module.exports = { State };

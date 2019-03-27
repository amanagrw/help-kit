const mongoose = require("mongoose");

var citySchema = new mongoose.Schema({
  cityId: {
    type: Number,
    required: true
  },
  stateId: {
    type: Number,
    required: true
  },
  value: {
    type: String,
    required: true
  }
});

var City = mongoose.model("Cities", citySchema);

module.exports = { City };

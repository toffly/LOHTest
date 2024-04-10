const mongoose = require("mongoose");

const navigationsSchema = mongoose.Schema({
  id: Number,
  key: String,
  name: String,
  type: String,
  icon: String,
  navigation_id: Number, //  relationship with id in navigations // null is root
  comment: String,
  sequence: Number,
  active: Boolean,
});

const Navigations = mongoose.model('navigations', navigationsSchema);

module.exports = Navigations;
const mongoose = require("./db");

const OrderSchema = new mongoose.Schema({
  ticId: String,
  outTime: String,
  outDate: String,
  overTime: String,
  price: Number,
  disCount: Number,
  totalVote: Number,
  resVote: Number,
  outCity: String,
  overCity: String,
  userName: String
});

module.exports = mongoose.model("order", OrderSchema);

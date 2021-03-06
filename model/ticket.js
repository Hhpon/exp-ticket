const mongoose = require("./db");

const TicketSchema = new mongoose.Schema({
  ticId: String,
  outTime: String,
  outDate: String,
  overTime: String,
  price: Number,
  disCount: Number,
  totalVote: Number,
  resVote: Number,
  outCity: String,
  overCity: String
});

module.exports = mongoose.model("addtic", TicketSchema);

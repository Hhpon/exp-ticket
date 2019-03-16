const mongoose = require('./db')

const TicketSchema = new mongoose.Schema({
  ticId: String,
  date: Array,
  price: Number,
  disCount: Number,
  totalVote: Number,
  resVote: Number,
  outCity: String,
  overCity: String
})

module.exports = mongoose.model('addtic', TicketSchema)
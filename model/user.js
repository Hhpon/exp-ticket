const mongoose = require("./db");

const UserSchema = new mongoose.Schema({
  userName: String,
  passWord: String,
  name: String,
  idCard: String
});

module.exports = mongoose.model("user", UserSchema);

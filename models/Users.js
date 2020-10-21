const mongoose = require("mongoose");

const UsersSchema = mongoose.Schema({
   name: {
    type: String,
    required: true
  },
   email: {
    type: String,
    required: true
  },
   password: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  }
});

// export model user with UserSchema
module.exports = mongoose.model("users", UsersSchema);

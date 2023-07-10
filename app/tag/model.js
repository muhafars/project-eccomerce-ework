const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const tagSchema = Schema({
  name: {
    type: String,
    minLength: [3, "Minimal panjang character 3 char"],
    maxLength: [20, "Maximum panjang charater 20"],
    required: [true, "Nama tag harus terisi"],
  },
});

module.exports = model("Tag", tagSchema);

const mongoose = require("mongoose");
const { model, Schema } = mongoose;
let categorySchema = Schema({
  name: {
    type: "string",
    minLength: [3, "panjang nama kategori minimal 3 karakter"],
    maxLength: [20, "panjang nama kategori maksimum 20 karakter"],
    required: [true, "Nama kategori harus terisi"],
  },
});

module.exports = model("Category", categorySchema);

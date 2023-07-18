const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const cartItemSchema = Schema({
  name: {
    type: String,
    required: [true, "Nama Item diperlukan"],
    minLength: [5, "Panjang minimal item 5 Karakter"],
  },
  qty: {
    type: Number,
    required: [true, "Status Quantity diperlukan"],
    min: [1, "Quantity minimum adalah 1"],
  },
  price: {
    type: Number,
    default: 0,
  },
  image_url: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
});

module.exports = model("CartItem", cartItemSchema);

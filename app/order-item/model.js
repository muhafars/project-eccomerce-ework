const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const orderItemSchema = Schema({
  name: {
    type: String,
    required: [true, "Nama item Harus di Isi"],
    minLength: [5, "Panjang Minimal Item 5 Karakter"],
  },
  price: {
    type: Number,
    required: [true, "Harga Item Harus di Isi"],
  },
  qty: {
    type: Number,
    required: [true, "Jumlah Item Diperlukan"],
    min: [1, "Kuantitas minimal 1"],
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: "Order",
  },
});

module.exports = model("OrderItem", orderItemSchema);

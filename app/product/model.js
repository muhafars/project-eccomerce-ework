const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const productSchema = Schema(
  {
    name: {
      type: String,
      minLength: [3, "Panjang makanan anda minimal 3 characters"],
      required: [true, "Dibutuhkan nama makanan"],
    },
    description: {
      type: String,
      maxLength: [1000, "Panjang deskripsi maksimal 1000 karakter"],
    },
    price: {
      type: Number,
      default: 0,
    },
    image_url: {
      type: String,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    tags: {
      type: Schema.Types.ObjectId,
      ref: "Tag",
    },
  },
  { timestamps: true }
);

module.exports = model("Product", productSchema);

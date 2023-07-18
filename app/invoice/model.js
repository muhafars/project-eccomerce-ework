const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const invoiceSchema = Schema(
  {
    sub_total: {
      type: Number,
      required: [true, "Sub Total harus diisi"],
    },
    delivery_fee: {
      type: Number,
      required: [true, "Ongkos kirim harus di isi"],
    },
    delivery_address: {
      provinsi: { type: String, required: [true, "Provinsi harus di Isi"] },
      kabupaten: { type: String, required: [true, "Nama Kabupaten Harus di Isi"] },
      kecamatan: { type: String, required: [true, "Nama Kecamatan Harus di Isi"] },
      kelurahan: { type: String, required: [true, "Nama Kelurahan Harus di Isi"] },
      detail: { type: String },
    },
    total: {
      type: Number,
      required: [true, "jumlah harus diisi"],
    },
    payment_status: {
      type: String,
      enum: ["waiting_payment", "paid"],
      default: "waiting_payment",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  },
  { timestamps: true }
);

module.exports = model("Invoice", invoiceSchema);

const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const deliveryAddressSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Nama Harus di Isi"],
      maxLength: [255, "Panjang Maksimal Nama 255 Karakter"],
    },
    kelurahan: {
      type: String,
      required: [true, "Kelurahan Harus di Isi"],
      maxLength: [255, "Panjang Maksimal Kelurahan 255 Karakter"],
    },
    kecamatan: {
      type: String,
      required: [true, "Kecamatan Harus di Isi"],
      maxLength: [255, "Panjang Maksimal Kecamatan 255 Karakter"],
    },
    kabupaten: {
      type: String,
      required: [true, "Kabupaten Harus di Isi"],
      maxLength: [255, "Panjang Maksimal Kabupaten 255 karakter"],
    },
    provinsi: {
      type: String,
      required: [true, "Provinsi Harus di Isi"],
      maxLength: [255, "Panjang Maksimal Provinsi 255 Karakter"],
    },
    detail: {
      type: String,
      required: [true, "Detail Alamat Harus di Isi"],
      maxLength: [1000, "Panjang Maksimal Detail Alamat 1000 Karakter"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = model("DeliveryAddress", deliveryAddressSchema);

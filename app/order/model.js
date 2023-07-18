const mongoose = require("mongoose");
const { model, Schema } = mongoose;
// const AutoIncrement = require("mongoose-sequence")(mongoose);

const orderSchema = Schema(
  {
    status: {
      type: String,
      enum: ["waiting_payment", "processing", "in_deliver", "delivered"],
      default: "waiting_payment",
    },
    delivery_fee: {
      type: Number,
      default: 0,
    },
    delivery_address: {
      provinsi: { type: String, required: [true, "Provinsi harus di Isi"] },
      kabupaten: { type: String, required: [true, "Nama Kabupaten Harus di Isi"] },
      kecamatan: { type: String, required: [true, "Nama Kecamatan Harus di Isi"] },
      kelurahan: { type: String, required: [true, "Nama Kelurahan Harus di Isi"] },
      detail: { type: String },
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    order_items: [
      {
        type: Schema.Types.ObjectId,
        ref: "OrderItem",
      },
    ],
  },
  { timestamps: true }
);
orderSchema.plugin(AutoIncrement, { inc_field: "order_number", disable_hooks: true });
// orderSchema.pre("save", async function (next) {
//   if (!this.isNew) {
//     return next();
//   }

//   const lastOrder = await model("Order").findOne({}, {}, { sort: { order_number: -1 } });
//   const lastOrderNumber = lastOrder ? lastOrder.order_number : 0;
//   this.order_number = lastOrderNumber + 1;

//   next();
// });

orderSchema.virtual("items_count").get(function () {
  return this.order_items.reduce((total, item) => total + parseInt(item.qty), 0);
});
orderSchema.post("save", async function () {
  let sub_total = this.order_items.reduce(
    (total, item) => (total += parseInt(item.price * item.qty)),
    0
  );
  let invoice = new Invoice({
    user: this.user,
    order: this._id,
    sub_total,
    delivery_fee: parseInt(this.delivery_fee),
    total: parseInt(sub_total + this.delivery_fee),
    delivery_address: this.delivery_address,
  });
  await invoice.save();
});
module.exports = model("Order", orderSchema);

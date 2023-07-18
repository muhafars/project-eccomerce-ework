const CartItem = require("../cart-item/model");
const DeliveryAddress = require("../deliveryAddress/model");
const Order = require("../order/model");
const OrderItem = require("../order-item/model");
const { Types } = require("mongoose");

const store = async function (req, res, next) {
  try {
    const { delivery_fee, delivery_address } = req.body;
    const item = await CartItem.find({ user: user._id }).populate("product");
    if (!item) {
      return res.json({
        error: 1,
        message: "You are not create order because you have not items in cart",
      });
    }
    const address = await DeliveryAddress.findById(delivery_address);
    const order = new Order({
      _id: new Types.ObjectId(),
      status: "waiting payment",
      delivery_fee,
      delivery_address: {
        provinsi: address.provinsi,
        kabupaten: address.kabupaten,
        kecamatan: address.kecamatan,
        kelurahan: address.kelurahan,
        detail: address.detail,
      },
      user: req.user._id,
    });
    const orderItems = await OrderItem.insertMany(
      items.map(item => ({
        ...item,
        name: item.product.name,
        qty: parseInt(item.qty),
        price: parseInt(item.product.price),
        order: order._id,
        product: item.product._id,
      }))
    );
    orderItems.forEach(item => order.order_items.push(item));
    order.save();
    await CartItem.deleteMany({ user: req.user._id });
    return res.json(order);
  } catch (err) {
    if (err && err.name === "ValidationError") {
      res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

const index = async function (req, res, next) {
  try {
    const { skip = 0, limit = 10 } = req.body;
    const count = await Order.find({ user: req.user._id }).countDocuments();
    const orders = await Order.find({ user: req.user._id })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate("order_items")
      .sort("-createdAt");
    return res.json({
      data: orders.map(order => order.toJSON({ virtual: true })),
      count,
    });
  } catch (err) {
    if (err && err.name === "ValidationError") {
      res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

module.exports = { index, store };

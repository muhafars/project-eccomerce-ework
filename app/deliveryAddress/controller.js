const { subject } = require("@casl/ability");
const DeliveryAddress = require("./model");
const { policyFor } = require("../../utils");

const store = async function (req, res, next) {
  try {
    const payload = req.body;
    const user = req.user;
    const address = new DeliveryAddress({
      ...payload,
      user: user._id,
    });
    await address.save();
    return res.json(address);
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

const update = async function (req, res, next) {
  try {
    const { _id, ...payload } = req.body;
    const id = req.params;
    let address = await DeliveryAddress.findById();
    const subjectAddress = subject("DeliveryAddress", { ...address, user_id: address.user });
    const policy = policyFor(req.user);
    if (!policy.can("update", subjectAddress)) {
      return res.json({
        error: 1,
        message: "You are not allowed to modify this resource",
      });
    }
    address = await DeliveryAddress.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
    return res.json(address);
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
    const { skip = 0, limit = 10 } = req.query;
    const count = await DeliveryAddress.find({ user: user._id }).countDocument();
    const address = await DeliveryAddress.find({ user: req.user._id })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .sort("-createdAt");
    return res.json({ data: address, count });
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

const destroy = async function (req, res, next) {
  try {
    const { id } = req.params;
    let address = await DeliveryAddress.findById(id);
    const subjectAddress = subject("DeliveryAddress", { ...address, user_id: address.user });
    const policy = policyFor(req.user);
    if (!policy.can("delete", subjectAddress)) {
      return res.json({
        error: 1,
        message: "You are not allowed to delete this resource",
      });
    }
    address = await DeliveryAddress.findByIdAndDelete(id);
    res.json(address);
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

module.exports = { store, update, index, destroy };

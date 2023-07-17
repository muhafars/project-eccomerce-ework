const DeliveryAddress = require("./model");

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
    const payload = req.body;
    const user_id = req.user._id;
    const address = await DeliveryAddress.findByIdAndUpdate(user_id, payload, {
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
    const { search } = req.query;
    const users_id = req.user._id;
    // search by users id
    if (id) {
      try {
        const address = await DeliveryAddress.findById(users_id);
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
    }
    //search by query
    else if (search) {
      const address = await DeliveryAddress.find({
        name: { $regex: search, $options: "i" },
      });
      if (category.length === 0) {
        return res.json({
          error: 1,
          message: "Alamat tidak ditemukan",
        });
      }
      res.json(address);
    }
    // show all
    else {
      const address = await DeliveryAddress.find();
      return res.json(address);
    }
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
    const users_id = req.user._id;
    const address = await DeliveryAddress.findByIdAndRemove(users_id);
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

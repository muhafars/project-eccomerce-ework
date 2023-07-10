const Tags = require("./model");

const store = async function (req, res, next) {
  try {
    let payload = req.body;
    let tag = new Tags(payload);
    await tag.save();
    return res.json(tag);
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.error,
      });
    }
    next(err);
  }
};

const update = async function (req, res, next) {
  try {
    let payload = req.body;
    const id = req.params.id;

    let tag = await Tags.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
    return res.json(tag);
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

const view = async function (req, res, next) {
  try {
    const { search } = req.query;
    const id = req.params.id;

    // - id filter
    if (id) {
      try {
        const tag = await Tags.findById(id);
        res.json(tag);
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
    //search filter
    else if (search) {
      const tag = await Tags.find({
        name: { $regex: search, $options: "i" },
      });
      if (tag.length === 0) {
        return res.json({
          error: 1,
          message: "No tag found",
        });
      }
      res.json(tag);
    }
    // all
    else {
      const tag = await Tags.find();
      res.json(tag);
    }
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

const destroy = async function (req, res, next) {
  try {
    const id = req.params.id;
    const tag = await Tags.findByIdAndRemove(id);
    res.json(tag);
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

module.exports = { view, destroy, update, store };

const Categories = require("./model");

const store = async function (req, res, next) {
  try {
    let payload = req.body;
    let category = new Categories(payload);
    await category.save();
    return res.json(category);
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

const update = async function (req, res, next) {
  try {
    let payload = req.body;
    let category = await Categories.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });
    return res.json(category);
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
    //id filter
    if (id) {
      try {
        const category = await Categories.findById(id);
        res.json(category);
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
    // search filter
    else if (search) {
      const category = await Categories.find({
        name: { $regex: search, $options: "i" },
      });
      if (category.length === 0) {
        return res.json({
          error: 1,
          message: "Category not found",
        });
      }
      res.json(category);
    } else {
      const category = await Categories.find();
      res.json(category);
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
    const category = await Categories.findByIdAndRemove(id);
    res.json(category);
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

module.exports = { view, update, store, destroy };

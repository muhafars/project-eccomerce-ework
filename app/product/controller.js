const path = require("path");
const fs = require("fs");
const config = require("../config");
const Product = require("./model");
const Category = require("../category/model");
const Tags = require("../tag/model");

// const view = async function (req, res, next) {
//   try {
//     const { search } = req.query;
//     const id = req.params.id;
//     //id filter
//     if (id) {
//       const product = await Product.findById(id);
//       if (!product) {
//         return res.json({
//           error: 1,
//           message: "Product not found",
//         });
//       }
//       res.json(product);
//     }
//     // search filter
//     else if (search) {
//       product = await Product.find({
//         $or: [
//           { name: { $regex: search, $options: "i" } },
//           { description: { $regex: search, $options: "i" } },
//         ],
//       });
//       if (product.length === 0) {
//         return res.json({
//           error: 1,
//           message: "Product not found",
//         });
//       }
//       res.json(product);
//     } else {
//       const products = await Product.find();
//       res.json(products);
//     }
//   } catch (err) {
//     if (err && err.name === "ValidationError") {
//       return res.json({
//         error: 1,
//         message: err.message,
//         fields: err.errors,
//       });
//     }
//     next(err);
//   }
// };

const index = async function (req, res, next) {
  try {
    const { skip = 0, limit = 10, q = "", category = "", tags = [] } = req.query;

    let criteria = {};

    if (q.length) {
      criteria.name = { $regex: q, $options: "i" };
    }

    if (category.length) {
      const categoryObj = await Category.findOne({ name: { $regex: category, $options: "i" } });
      if (categoryObj) {
        criteria.category = categoryObj._id;
      }
    }

    if (tags.length) {
      const tagsArr = await Tags.find({ name: { $in: tags } });
      criteria.tags = { $in: tagsArr.map(tag => tag._id) };
    }

    // console.log("criteria:", criteria);
    const count = await Product.find().countDocuments();
    const products = await Product.find(criteria)
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate("category")
      .populate("tags");
    return res.json({
      data: products,
      count,
    });
  } catch (err) {
    next(err);
  }
};

const destroy = async function (req, res, next) {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndRemove(id);
    res.json(product);
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
    const id = req.params.id;
    let payload = req.body;
    const product = await Product.findById(id);
    //Category
    if (payload.category) {
      let category = await Category.findOne({ name: { $regex: payload.category, $options: "i" } });
      if (category) {
        payload = { ...payload, category: category._id };
      } else {
        delete payload.category;
      }
    }
    // tag relation
    if (payload.tags && payload.tags.length > 0) {
      let tags = await Tags.find({ name: { $in: payload.tags } });
      if (tags.length > 0) {
        payload = { ...payload, tags: tags.map(tag => tag._id) };
      } else {
        delete payload.tags;
      }
    }

    if (req.file) {
      let tmp_path = req.file.path;
      let originalExt = req.file.originalname.split(".").pop();
      let fileName = req.file.filename + "." + originalExt;
      let target_path = path.resolve(config.rootPath, `public/images/products/${fileName}`);

      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);

      src.pipe(dest);

      src.on("end", async function () {
        try {
          product.image_url = fileName;
          Object.assign(product, payload);
          await product.save();
          return res.json(product);
        } catch (err) {
          fs.unlinkSync(target_path);
          if (err && err.name === "ValidationError") {
            return res.json({
              error: 1,
              message: err.message,
              fields: err.errors,
            });
          }
          next(err);
        }
      });

      src.on("error", async function (err) {
        next(err);
      });
    } else {
      Object.assign(product, payload);
      await product.save();
      return res.json(product);
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

const store = async function (req, res, next) {
  try {
    let payload = req.body;

    if (payload.category) {
      let category = await Category.find({ name: { $regex: payload.category, $options: "i" } });
      if (category) {
        payload = { ...payload, category: category._id };
      } else {
        delete payload.category;
      }
    }
    // -tag relation

    if (payload.tags && payload.tags.length > 0) {
      let tags = await Tags.find({ name: { $in: payload.tags } });
      if (tags.length > 0) {
        payload = { ...payload, tags: tags.map(tag => tag._id) };
      } else {
        delete payload.tags;
      }
    }

    if (req.file) {
      let tmp_path = req.file.path;
      let originalExt =
        req.file.originalname.split(".")[req.file.originalname.split(".").length - 1];
      let fileName = req.file.filename + "." + originalExt;
      let target_path = path.resolve(config.rootPath, `public/images/products/${fileName}`);

      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);
      src.on("end", async function () {
        try {
          let product = new Product({ ...payload, image_url: fileName });
          await product.save();
          return res.json(product);
        } catch (err) {
          fs.unlinkSync(target_path);
          if (err && err.name === "ValidationError") {
            return res.json({
              error: 1,
              message: err.message,
              fields: err.errors,
            });
          }
          next(err);
        }
      });
      src.on("error", async function (err) {
        next(err);
      });
    } else {
      let product = new Product(payload);
      await product.save();
      return res.json(product);
    }
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
  }
};

module.exports = { store, index, destroy, update };

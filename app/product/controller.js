const path = require("path");
const fs = require("fs");
const config = require("../config");
const Product = require("./model");
const Category = require("../category/model");

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
    let { skip = 0, limit = 10 } = req.query;
    let product = await Product.find()
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate("category");
    return res.json(product);
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
    let product = await Product.findById(id);
    //Category
    if (payload.category) {
      let category = await Category.findOne({ name: { $regex: payload.category, $options: "i" } });
      if (category) {
        payload = { ...payload, category: category._id };
      } else {
        delete payload.category;
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
      let category = await Category.findOne({ name: { $regex: payload.category, $options: "i" } });
      if (category) {
        payload = { ...payload, category: category._id };
      } else {
        delete payload.category;
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

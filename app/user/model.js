const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const AutoIncrement = require("mongoose-sequence")(mongoose);
const bcrypt = require("bcrypt");
const userSchema = Schema(
  {
    full_name: {
      type: String,
      required: [true, "Nama harus di isi"],
      maxLength: [255, "Panjang maksimum nama character 255"],
      minLength: [3, "Panjang minimum nama character 3"],
    },
    customer_id: {
      type: Number,
    },
    email: {
      type: String,
      required: [true, "Alamat email harus di isi"],
      maxLength: [255, "Panjang maksimum email character 255"],
    },
    password: {
      type: String,
      required: [true, "Password harus di isi"],
      maxLength: [255, "Panjang maksimum password character 255"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    token: [String],
  },
  { timestamps: true }
);

/**
 *- Use async function for validate email address
userSchema.path("email").validate(async function (value) {
  try {
    const EMAIL_RE = /^([\w-]+@[\w-]+\.)+[\w-]{2,4}?$/;
    return EMAIL_RE.test(value);
  } catch (err) {
    throw err;
  }
}, attr => `${attr.value} harus merupakan email yang valid`);
 */

userSchema.path("email").validate(
  function (value) {
    const EMAIL_RE = /^([\w-]+@[\w-]+\.)+[\w-]{2,4}?$/;
    return EMAIL_RE.test(value);
  },
  attr => `${attr.value} harus merupakan email yang valid`
);

userSchema.path("email").validate(
  async function (value) {
    try {
      const count = await this.model("User").count({ email: value });
      return !count;
    } catch (err) {
      throw err;
    }
  },
  attr => `${attr.value} sudah terdaftar`
);

const HASH_ROUND = 10;
userSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, HASH_ROUND);
  next();
});

userSchema.plugin(AutoIncrement, { inc_field: "customer_id" });
module.exports = model("User", userSchema);

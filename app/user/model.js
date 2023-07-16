const mongoose = require("mongoose");
const { Schema, model } = mongoose;
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
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Alamat email harus di isi"],
      maxLength: [255, "Panjang maksimum email character 255"],
      validate: {
        validator: function (value) {
          const EMAIL_RE = /^([\w-\.]+@[\w-]+\.)+[\w-]{2,4}?$/;
          return EMAIL_RE.test(value);
        },
        message: `harus merupakan email yang valid`,
      },
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

const HASH_ROUND = 10;
userSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, HASH_ROUND);
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.customer_id) {
    try {
      const User = model("User");
      const lastUser = await User.findOne().sort({ customer_id: -1 });
      if (lastUser) {
        this.customer_id = lastUser.customer_id + 1;
      } else {
        this.customer_id = 1;
      }
    } catch (error) {
      next(error);
    }
  }
  next();
});

module.exports = model("User", userSchema);

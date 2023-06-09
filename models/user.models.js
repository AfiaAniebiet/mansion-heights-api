const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
const Apartment = require("./property.models");
// const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Provide your fullname"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordTokenExpiration: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "undisclosed", "none"],
    },
    tel_number: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Home Owner", "Student", "admin"],
      required: true,
    },
    apartments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Apartment",
      },
    ],
  },
  { timestamps: true }
);

// Hashing password before storing in the database
UserSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method to compare passwords before logging in
UserSchema.methods.comparePassword = async function (enteredPassword) {
  const isPasswordMatch = await bcrypt.compare(enteredPassword, this.password);
  return isPasswordMatch;
};

// delete a user with associated apartments
UserSchema.post("findOneAndDelete", async function (user) {
  if (user.apartments.length) {
    await Apartment.deleteMany({ _id: { $in: user.apartments } });
  }
});

module.exports = mongoose.model("User", UserSchema);

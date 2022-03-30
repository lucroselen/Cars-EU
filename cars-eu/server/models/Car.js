const mongoose = require("mongoose");
const carSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: [true, "The name of the brand cannot be blank!"],
    minlength: [3, "The name of the brand should be at least 3 characters!"],
  },
  model: {
    type: String,
    required: [true, "The name of the model cannot be blank!"],
    minlength: [2, "The name of the model should be at least 2 characters!"],
  },
  fuelType: {
    type: String,
    required: [true, "The fuel type cannot be blank!"],
    minlength: [3, "The fuel type should be at least 3 characters!"],
  },
  year: {
    type: Number,
    required: [true, "Please populate the year"],
  },
  imgUrl: {
    type: String,
    required: [true, "Please provide a car image link."],
    validate: [
      /^https?:\/\//i,
      "The car image should start with http:// or https://",
    ],
  },
  description: {
    type: String,
    required: [true, "The description cannot be blank!"],
    minlength: [8, "The description should be a minimum of 8 characters long"],
  },
  mileage: {
    type: Number,
    required: [true, "The mileage cannot be blank!"],
    min: [0, "The mileage cannot be a negative number!"],
    max: [
      500000,
      "Cars with milage more than 500000 KM will not be listed on our application.",
    ],
  },
  price: {
    type: Number,
    required: [true, "The price cannot be blank!"],
    min: [0, "The price cannot be a negative number!"],
    max: [999999999999, "Can you even pronounce this number?"],
  },
  rating: {
    type: Number,
    default: 0,
  },
  votes: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  creator: { type: mongoose.Types.ObjectId, ref: "User" },
  comments: {
    type: Array,
    default: [],
  },
});

const Car = mongoose.model("Car", carSchema);

module.exports = Car;

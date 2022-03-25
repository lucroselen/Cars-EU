const mongoose = require("mongoose");
const bookSchema = new mongoose.Schema({
  bookName: {
    type: String,
    required: [true, "The name of the Book cannot be blank!"],
    minlength: [3, "The name of the book should be at least 3 characters!"],
  },
  authorName: {
    type: String,
    required: [true, "The name of the Author cannot be blank!"],
    minlength: [6, "The name of the author should be at least 6 characters!"],
  },
  genre: {
    type: String,
    required: [true, "The genre cannot be blank!"],
    minlength: [3, "The genre should be at least 3 characters!"],
  },
  date: {
    type: Date,
    required: [true, "Please select a Date"],
  },
  imgUrl: {
    type: String,
    required: [true, "Please provide a book's cover image link."],
    validate: [
      /^https?:\/\//i,
      "The book's cover image should start with http:// or https://",
    ],
  },
  summary: {
    type: String,
    required: [true, "The summary cannot be blank!"],
    minlength: [8, "The summary should be a minimum of 8 characters long"],
  },
  isbn: {
    type: Number,
    required: [true, "The ISBN cannot be blank!"],
    min: [1000000000, "The ISBN should be a minimum of 10 characters long"],
    max: [9999999999999, "The ISBN should be a maximum of 13 characters long"],
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

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;

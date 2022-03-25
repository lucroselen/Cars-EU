const Book = require("../models/Book");
const User = require("../models/User");

const create = (data) => Book.create(data);
const getAll = () => Book.find({});
const getTop10 = () =>
  Book.find({})
    .sort([["rating", "desc"]])
    .limit(10);
const getOne = (id) => Book.findById(id).populate("creator").populate("votes");
const deleteRecord = (id) => Book.deleteOne({ _id: id });

const voteUp = async (bookId, userId) => {
  let book = await Book.findById(bookId);
  let user = await User.findById(userId);

  book.votes.push(user);
  book.rating += 1;

  book.save();
  return;
};

const voteDown = async (bookId, userId) => {
  let book = await Book.findById(bookId);
  let user = await User.findById(userId);

  book.votes.push(user);
  book.rating -= 1;

  book.save();
  return;
};

const favorite = async (bookId, userId) => {
  let book = await Book.findById(bookId);
  let user = await User.findById(userId);

  let favoriteBooks = user.favorites;
  favoriteBooks.push(book);

  await User.updateOne({ _id: userId }, { favorites: favoriteBooks });
};

const edit = (
  bookId,
  bookName,
  authorName,
  imgUrl,
  isbn,
  date,
  summary,
  genre
) =>
  Book.updateOne(
    { _id: bookId },
    {
      bookName,
      authorName,
      imgUrl,
      isbn,
      date,
      summary,
      genre,
    },
    { runValidators: true }
  );

const comment = async (bookId, comment) => {
  let book = await getOne(bookId);
  let addComments = book.comments;
  addComments.unshift(comment);
  await Book.updateOne(
    { _id: bookId },
    {
      comments: addComments,
    },
    { runValidators: true }
  );
};

const bookServices = {
  create,
  getAll,
  getOne,
  deleteRecord,
  getTop10,
  voteUp,
  voteDown,
  favorite,
  edit,
  comment,
};
module.exports = bookServices;

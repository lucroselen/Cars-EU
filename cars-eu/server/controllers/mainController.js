const express = require("express");

const { errorHandler } = require("../middlewares/errorHandler");
const { isAuth } = require("../middlewares/authMiddleware");
const router = express.Router();
const bookServices = require("../services/bookServices");
const User = require("../models/User");
const authServices = require("../services/authServices");

let generalError =
  "We are experiencing technical difficulties and are working to resolve them. Thank you for your understanding!";

router.get("/all-books", async (req, res) => {
  try {
    let books = await bookServices.getAll();

    res.json({ books });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      error: generalError,
    });
  }
});

router.get("/top-10", async (req, res) => {
  try {
    let books = await bookServices.getTop10();

    res.json({ books });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      error: generalError,
    });
  }
});

router.post("/add", isAuth, async (req, res) => {
  let { bookName, authorName, imgUrl, isbn, date, summary, genre, creator } =
    req.body;

  try {
    await bookServices.create({
      bookName,
      authorName,
      imgUrl,
      isbn,
      date,
      summary,
      genre,
      creator,
    });
    res.json({ message: "Book created successfully!" });
  } catch (error) {
    res.status(400).json({ error: errorHandler(error) });
  }
});

router.post("/edit/:id", isAuth, async (req, res) => {
  let { bookName, authorName, imgUrl, isbn, date, summary, genre, creator } =
    req.body;
  let bookId = req.params.id;
  try {
    if (creator?._id.toString() === req.user?._id) {
      await bookServices.edit(
        bookId,
        bookName,
        authorName,
        imgUrl,
        isbn,
        date,
        summary,
        genre
      );
      res.json({ message: "Book edited successfully!" });
    } else {
      res.status(403).json({ error: "You are not the owner of this book!" });
    }
  } catch (error) {
    res.status(400).json({ error: errorHandler(error) });
  }
});

router.get("/details/:id", async (req, res) => {
  try {
    let book = await bookServices.getOne(req.params.id);
    let user = await User.findById(req.user?._id);
    let voted = book.votes.find((x) => x._id.toString() === req.user?._id);
    let isOwnedBy = book.creator._id.toString() === req.user?._id;
    let isInFavorites = user?.favorites.find(
      (x) => book._id.toString() === x.toString()
    );
    res.json({ book, voted, isOwnedBy, isInFavorites });
  } catch (error) {
    res.json({ error: errorHandler(error) });
  }
});

router.get("/delete/:id", isAuth, async (req, res) => {
  let book = await bookServices.getOne(req.params.id);
  try {
    if (book.creator._id.toString() === req.user._id) {
      await bookServices.deleteRecord(req.params.id);
      res.json({ message: "Book deleted successfully!" });
    } else {
      res.status(403).json({ error: "You are not the owner of this book!" });
    }
  } catch (error) {
    res.json({ error: errorHandler(error) });
  }
});

router.get("/vote-up/:id", isAuth, async (req, res) => {
  let bookId = req.params.id;
  let book = await bookServices.getOne(req.params.id);
  try {
    if (
      !(book.creator._id.toString() === req.user._id) &&
      !book.votes.find((x) => x._id.toString() === req.user._id)
    ) {
      await bookServices.voteUp(bookId, req.user._id);

      res.json({ message: "Book liked" });
    } else {
      res
        .status(403)
        .json({ error: "You are not allowed to like/dislike this book!" });
    }
  } catch (error) {
    res.status(400).json({ error: generalError });
  }
});

router.get("/vote-down/:id", isAuth, async (req, res) => {
  let bookId = req.params.id;
  let book = await bookServices.getOne(req.params.id);
  try {
    if (
      !(book.creator._id.toString() === req.user._id) &&
      !book.votes.find((x) => x._id.toString() === req.user._id)
    ) {
      await bookServices.voteDown(bookId, req.user._id);

      res.json({ message: "Book disliked!" });
    } else {
      res
        .status(403)
        .json({ error: "You are not allowed to like/dislike this book!" });
    }
  } catch (error) {
    res.status(400).json({ error: generalError });
  }
});

router.get("/favorite/:id", isAuth, async (req, res) => {
  let bookId = req.params.id;
  let book = await bookServices.getOne(req.params.id);
  let user = await authServices.getUserById(req.user?._id);
  try {
    if (
      !(book.creator._id.toString() === req.user._id) &&
      !user.favorites.find((x) => x._id.toString() === bookId)
    ) {
      await bookServices.favorite(bookId, req.user._id);

      res.json({ message: "Book added to favorites!" });
    } else {
      res.status(403).json({
        error: "You are not allowed to add this book to favourites!",
      });
    }
  } catch (error) {
    res.status(400).json({ error: generalError });
  }
});

router.post("/comment/:id", isAuth, async (req, res) => {
  let { comment } = req.body;
  let bookId = req.params.id;
  let user = await authServices.getUserById(req.user?._id);
  let userComment = `${user.firstName} ${user.lastName}: ${comment}`;
  try {
    await bookServices.comment(bookId, userComment);

    res.json({ message: "Comment added successfully!" });
  } catch (error) {
    res.status(400).json({ error: generalError });
  }
});

module.exports = router;

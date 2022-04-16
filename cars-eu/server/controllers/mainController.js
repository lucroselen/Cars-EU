const express = require("express");

const { errorHandler } = require("../middlewares/errorHandler");
const { isAuth } = require("../middlewares/authMiddleware");
const router = express.Router();
const carServices = require("../services/carServices");
const User = require("../models/User");
const authServices = require("../services/authServices");

let generalError =
  "We are experiencing technical difficulties and are working to resolve them. Thank you for your understanding!";

router.get("/all-cars", async (req, res) => {
  try {
    let cars = await carServices.getAll();

    res.json({ cars });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      error: generalError,
    });
  }
});

router.get("/top-10", async (req, res) => {
  try {
    let cars = await carServices.getTop10();

    res.json({ cars });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      error: generalError,
    });
  }
});

router.post("/add", isAuth, async (req, res) => {
  let {
    brand,
    model,
    description,
    imgUrl,
    mileage,
    year,
    price,
    fuelType,
    creator,
  } = req.body;

  try {
    await carServices.create({
      brand,
      model,
      description,
      imgUrl,
      mileage,
      year,
      price,
      fuelType,
      creator,
    });
    res.json({ message: "Car created successfully!" });
  } catch (error) {
    res.status(400).json({ error: errorHandler(error) });
  }
});

router.post("/edit/:id", isAuth, async (req, res) => {
  let {
    brand,
    model,
    description,
    imgUrl,
    mileage,
    year,
    price,
    fuelType,
    creator,
  } = req.body;
  let carId = req.params.id;
  try {
    if (creator._id.toString() === req.user?._id) {
      await carServices.edit(
        carId,
        brand,
        model,
        description,
        imgUrl,
        mileage,
        year,
        price,
        fuelType
      );
      res.json({ message: "Car edited successfully!" });
    } else {
      res.status(403).json({ error: "You are not the owner of this car!" });
    }
  } catch (error) {
    res.status(400).json({ error: errorHandler(error) });
  }
});

router.get("/details/:id", async (req, res) => {
  try {
    let car = await carServices.getOne(req.params.id);
    let user = await User.findById(req.user?._id);
    let voted =
      car.votes.find((x) => x._id.toString() === req.user?._id) || false;
    let isOwnedBy = car.creator._id.toString() === req.user?._id || false;
    let isInFavorites =
      user?.favorites.find((x) => car._id.toString() === x.toString()) || false;
    res.json({ car, voted, isOwnedBy, isInFavorites });
  } catch (error) {
    console.log(error);
    res.json({ error: errorHandler(error) });
  }
});

router.get("/delete/:id", isAuth, async (req, res) => {
  let car = await carServices.getOne(req.params.id);
  try {
    if (car.creator._id.toString() === req.user._id) {
      await carServices.deleteRecord(req.params.id);
      res.json({ message: "Car deleted successfully!" });
    } else {
      res.status(403).json({ error: "You are not the owner of this car!" });
    }
  } catch (error) {
    res.json({ error: errorHandler(error) });
  }
});

router.get("/vote-up/:id", isAuth, async (req, res) => {
  let carId = req.params.id;
  let car = await carServices.getOne(req.params.id);
  try {
    if (
      !(car.creator._id.toString() === req.user._id) &&
      !car.votes.find((x) => x._id.toString() === req.user._id)
    ) {
      await carServices.voteUp(carId, req.user._id);

      res.json({ message: "Car liked" });
    } else {
      res
        .status(403)
        .json({ error: "You are not allowed to like/dislike this car!" });
    }
  } catch (error) {
    res.status(400).json({ error: generalError });
  }
});

router.get("/vote-down/:id", isAuth, async (req, res) => {
  let carId = req.params.id;
  let car = await carServices.getOne(req.params.id);
  try {
    if (
      !(car.creator._id.toString() === req.user._id) &&
      !car.votes.find((x) => x._id.toString() === req.user._id)
    ) {
      await carServices.voteDown(carId, req.user._id);

      res.json({ message: "Car disliked!" });
    } else {
      res
        .status(403)
        .json({ error: "You are not allowed to like/dislike this car!" });
    }
  } catch (error) {
    res.status(400).json({ error: generalError });
  }
});

router.get("/favorite/:id", isAuth, async (req, res) => {
  let carId = req.params.id;
  let car = await carServices.getOne(req.params.id);
  let user = await authServices.getUserById(req.user?._id);
  try {
    if (
      !(car.creator._id.toString() === req.user._id) &&
      !user.favorites.find((x) => x._id.toString() === carId)
    ) {
      await carServices.favorite(carId, req.user._id);

      res.json({ message: "Car added to favorites!" });
    } else {
      res.status(403).json({
        error: "You are not allowed to add this car to favourites!",
      });
    }
  } catch (error) {
    res.status(400).json({ error: generalError });
  }
});

router.post("/comment/:id", isAuth, async (req, res) => {
  let { comment } = req.body;
  let carId = req.params.id;
  let user = await authServices.getUserById(req.user?._id);
  let userComment = `${user.firstName} ${user.lastName}: ${comment}`;
  try {
    await carServices.comment(carId, userComment);

    res.json({ message: "Comment added successfully!" });
  } catch (error) {
    res.status(400).json({ error: generalError });
  }
});

module.exports = router;

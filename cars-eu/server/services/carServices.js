const Car = require("../models/Car");
const User = require("../models/User");

const create = (data) => Car.create(data);
const getAll = () => Car.find({});
const getTop10 = () =>
  Car.find({})
    .sort([["rating", "desc"]])
    .limit(10);
const getOne = (id) => Car.findById(id).populate("creator").populate("votes");
const deleteRecord = (id) => Car.deleteOne({ _id: id });

const voteUp = async (carId, userId) => {
  let car = await Car.findById(carId);
  let user = await User.findById(userId);

  car.votes.push(user);
  car.rating += 1;

  car.save();
  return;
};

const voteDown = async (carId, userId) => {
  let car = await Car.findById(carId);
  let user = await User.findById(userId);

  car.votes.push(user);
  car.rating -= 1;

  car.save();
  return;
};

const favorite = async (carId, userId) => {
  let car = await Car.findById(carId);
  let user = await User.findById(userId);

  let favoriteCars = user.favorites;
  favoriteCars.push(car);

  await User.updateOne({ _id: userId }, { favorites: favoriteCars });
};

const edit = (
  carId,
  brand,
  model,
  description,
  imgUrl,
  mileage,
  year,
  price,
  fuelType
) =>
  Car.updateOne(
    { _id: carId },
    {
      brand,
      model,
      description,
      imgUrl,
      mileage,
      year,
      price,
      fuelType,
    },
    { runValidators: true }
  );

const comment = async (carId, comment) => {
  let car = await getOne(carId);
  let addComments = car.comments;
  addComments.unshift(comment);
  await Car.updateOne(
    { _id: carId },
    {
      comments: addComments,
    },
    { runValidators: true }
  );
};

const carServices = {
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
module.exports = carServices;

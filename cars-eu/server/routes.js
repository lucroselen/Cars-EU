const router = require("express").Router();

const userController = require("./controllers/userController");
const mainController = require("./controllers/mainController");

router.use("/users", userController);
router.use(mainController);

module.exports = router;

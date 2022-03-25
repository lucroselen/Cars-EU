const cookieParser = require("cookie-parser");
const config = require("./config/config")[process.env.NODE_ENV];
const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const initDatabase = require("./config/database");
const { auth } = require("./middlewares/authMiddleware");
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(auth);
app.use(routes);

initDatabase(config.DB_CONNECTION_STRING)
  .then(() => {
    app.listen(
      config.PORT,
      console.log(`Listening at http://localhost:${config.PORT}`)
    );
  })
  .catch((err) => {
    console.error(err);
  });

app.get("/", (req, res) => {
  res.json({ text: "Server is online!" });
});

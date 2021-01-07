const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");

//declare server port
const port = process.env.PORT || 5000;

//handle environment variable (.env file)
require("dotenv").config();

//express setup
const app = express();
app.use(cors());
app.use(express.json());

//bodyparser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//config server to handle front-end in production env
if (process.env.NODE_ENV === "production") {
  // Serve any static files
  app.use(express.static(path.join(__dirname, "client/build")));

  // Handle React routing, return all requests to React app
  app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "client/build", "index.html"));
  });
}

//database setup
mongoose.connect(
  process.env.DB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) console.log(err);
    console.log("Database Connected");
  }
);

// router
app.use("/users", require("./routes/user.route"));

// server listener
app.listen(port, () => console.log(`Listening on port ${port}`));

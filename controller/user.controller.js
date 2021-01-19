const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

//gives access to existing user
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Field missing" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User doesn't exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Password doesn't match" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    //JWT token expires after 2 days
    const expiryDate = new Date(Number(new Date()) + 172800000);
    res.cookie("token", token, {
      expire: expiryDate,
      httpOnly: true,
    });
    return res.json({
      user: {
        id: user._id,
        userName: user.userName,
      },
    });
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

//create a new user
const userRegistration = async (req, res) => {
  try {
    let { email, password, passwordCheck, userName } = req.body;
    if (!email || !password || !passwordCheck || !userName) {
      return res.status(400).json({ msg: "Field missing" });
    } else if (password.length < 5) {
      return res.status(400).json({ msg: "Minimum password length is 5" });
    } else {
      if (password != passwordCheck) {
        return res.status(400).json({ msg: "Password is not matching" });
      }
    }
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(400).json({ msg: "Email already exist" });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: passwordHash,
      userName,
    });
    const saveUser = await newUser.save();
    res.json({ msg: "User saved successfully", saveUser });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//check if existing user token is valid
const isTokenValid = async (req, res) => {
  try {
    //const token = req.header("Authorization");
    const token = req.cookies.token;
    if (!token) {
      return res.json(false);
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) {
      return res.json(false);
    }
    const user = await User.findById(verified.id);
    if (!user) {
      return res.json(false);
    }
    return res.json(true);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//get existing user id
const getUserId = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      return res.status("400").json({
        error: "User not found",
      });
    }
    return res.json({
      id: user._id,
      userName: user.userName,
      email: user.email,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  userLogin,
  userRegistration,
  isTokenValid,
  getUserId,
};

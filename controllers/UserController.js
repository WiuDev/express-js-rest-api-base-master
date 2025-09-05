const User = require("../models/User");
const PasswordToken = require("../models/PasswordToken");
let jwt = require("jsonwebtoken");
let bcrypt = require("bcrypt");

const secret = "iwjqheiorjqwioejoiqwjeopiqwjroihnfgioubhnfrgoikb";


class UserController {
  async index(req, res) {
    let users = await User.findAll();
    res.json(users);
  }

  async findUserById(req, res) {
    let id = req.params.id;
    let user = await User.findById(id);
    if (user == undefined) {
      res.status(404);
      res.json({});
    } else {
      res.status(200);
      res.json(user);
    }
  }
  async create(req, res) {
    let { name, email, password } = req.body;
    if (email == undefined) {
      return res.status(400).json({ error: "Email is invalid!" });
    }
    let emailExists = await User.findEmail(email);
    if (emailExists) {
      return res.status(400).json({ error: "Email already exists!" });
    }
    await User.create(email, password, name);
    res.status(200);
    res.send("tudo ok!");
  }

  async edit(req, res) {
    let { id, name, email, role } = req.body;
    let user = await User.findById(id);
    if (user == undefined) {
      return res.status(404).json({ error: "User not found!" });
    }
    let result = await User.update(id, name, email, role);
    if (result.status == false) {
      return res.status(400).json({ error: result.err });
    }
    res.status(200).json({ message: "User updated successfully!" });
  }

  async delete(req, res) {
    let id = req.params.id;
    let result = await User.delete(id);
    if (result.status) {
      res.status(200).json({ message: "User deleted successfully!" });
    } else {
      res.status(400).json({ error: result.err });
    }
  }

  async recoverPassword(req, res) {
    let email = req.body.email;
    let result = await PasswordToken.create(email);
    if (result.status) {
      res.status(200);
      res.send("" + result.token);
    } else {
      res.status(400);
      res.send(result.err);
    }
  }
  async changePassword(req, res) {
    let token = req.body.token;
    let password = req.body.password;
    let isTokenValid = await PasswordToken.validate(token);
    if (isTokenValid.status) {
      await User.changePassword(password,isTokenValid.token.user_id,isTokenValid.token.token );
      res.status(200);
      res.send("Password changed successfully!");
    } else {
      res.status(400);
      res.send("Invalid token!");
    }
  }

  async login(req, res) {
    let { email, password } = req.body;
    let user = await User.findByEmail(email);
    if (user != undefined) {
      let result = await bcrypt.compare(password, user.password);
      res.json({ status: result });
      if (result) {
        let token = jwt.sign({ email: user.email, role: user.role }, secret);
        res.status(200);
        res.json({ token: token });
      } else {
        res.status(406);
        res.send("Incorrect password!");
      }
    } else {
      res.json({ status: false });
    }
  }

}

module.exports = new UserController();

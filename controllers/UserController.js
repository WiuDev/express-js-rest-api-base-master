var User = require("../models/User");

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
}

module.exports = new UserController();

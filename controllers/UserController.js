var User = require("../models/User");

class UserController {
  async index(req, res) {
    let users = await User.findAll();
    res.json(users);
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
}

module.exports = new UserController();

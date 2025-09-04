var knex = require("../database/connection");
var bcrypt = require("bcrypt");

class User {
  async findAll() {
    try {
      return await knex.select(['id', 'name', 'email', 'role']).table("users");
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async create(email, password, name) {
    try {
      let hashedPassword = await bcrypt.hash(password, 10);
      await knex
        .insert({ email, password: hashedPassword, name, role: 0 })
        .table("users");
    } catch (err) {
      console.error(err);
    }
  }

  async findEmail(email) {
    try {
      let result = await knex
        .select("*")
        .from("users")
        .where({ email: email });

      if (result.length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error(err);
    }
  }
}

module.exports = new User();

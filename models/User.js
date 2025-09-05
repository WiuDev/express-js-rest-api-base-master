let knex = require("../database/connection");
let bcrypt = require("bcrypt");

class User {
  async findAll() {
    try {
      return await knex.select(["id", "name", "email", "role"]).table("users");
    } catch (err) {
      console.error(err);
      return [];
    }
  }
  async findById(id) {
    try {
      let user = await knex
        .select(["id", "name", "email", "role"])
        .where({ id: id })
        .table("users");
      if (user.length > 0) {
        return user[0];
      } else {
        return undefined;
      }
    } catch (err) {
      console.error(err);
      return undefined;
    }
  }
  async findByEmail(email) {
    try {
      let result = await knex
        .select(["id", "name", "email","email" ,"role"])
        .where({ email: email })
        .table("users");
      if (result.length > 0) {
        return result[0];
      } else {
        return undefined;
      }
    } catch (err) {
      console.error(err);
      return undefined;
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
      let result = await knex.select("*").from("users").where({ email: email });

      if (result.length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error(err);
    }
  }

  async update(id, name, email, role) {
    let user = await this.findById(id);
    if (user != undefined) {
      let editUser = {};
      if (email != undefined) {
        if (email != user.email) {
          let result = await this.findEmail(email);
          if (result == false) {
            editUser.email = email;
          } else {
            return { status: false, err: "The email already exists!" };
          }
        }
        if (name != undefined) {
          editUser.name = name;
        }
        if (role != undefined) {
          editUser.role = role;
        }
        try {
          await knex.update(editUser).where({ id: id }).table("users");
          return { status: true };
        } catch (err) {
          return { status: false, err: err };
        }
      } else {
        return { status: false, err: "The user does not exist!" };
      }
    }
  }

  async delete(id) {
    let user = await this.findById(id);
    if (user != undefined) {
      try {
        await knex.delete().where({ id: id }).table("users");
        return { status: true };
      } catch (err) {
        return { status: false, err: err };
      }
    } else {
      return { status: false, err: "The user does not exist!" };
    }
  }
  async changePassword(newPassword, id, token) {
    let hash = await bcrypt.hash(newPassword, 10);
    await knex
      .update({ password: hash })
      .where({ id: id })
      .table("users");
    await knex.update({ used: 1 }).where({ token: token }).table("passwordtokens");
  }

}
module.exports = new User();

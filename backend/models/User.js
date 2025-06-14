const pool = require("../config/db");

class User {
  static async findByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM Users WHERE Email = ?", [email]);
    return rows[0];
  }

  static async create(user) {
    const { Name, Email, Password } = user;
    const [result] = await pool.query(
      "INSERT INTO Users (Name, Email, Password) VALUES (?, ?, ?)",
      [Name, Email, Password]
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await pool.query("SELECT * FROM Users WHERE UserID = ?", [id]);
    return rows[0];
  }
}

module.exports = User;
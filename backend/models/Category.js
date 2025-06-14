const pool = require("../config/db");

class Category {
  static async getAll() {
    const [rows] = await pool.query("SELECT * FROM Categories");
    return rows;
  }

  static async getUserCategories(userId) {
    const [rows] = await pool.query(
      `SELECT c.* FROM User_Categories uc
       JOIN Categories c ON uc.CategoryID = c.CategoryID
       WHERE uc.UserID = ?`,
      [userId]
    );
    return rows;
  }

  static async addUserCategory(userId, categoryId) {
    const [result] = await pool.query(
      "INSERT INTO User_Categories (UserID, CategoryID) VALUES (?, ?)",
      [userId, categoryId]
    );
    return result.insertId;
  }
}

module.exports = Category;
const pool = require("../config/db");

class PaymentMethod {
  static async getAll() {
    const [rows] = await pool.query("SELECT * FROM PaymentMethods");
    return rows;
  }

  static async create(methodName) {
    const [result] = await pool.query(
      "INSERT INTO PaymentMethods (MethodName) VALUES (?)",
      [methodName]
    );
    return result.insertId;
  }
}

module.exports = PaymentMethod;
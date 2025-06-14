const pool = require("../config/db");

class Transaction {
  // Create a Transaction record (without PaymentID)
  static async create(transactionData) {
    const { UserID, UserCategoryID, Amount, Date, Description } = transactionData;
    const [result] = await pool.query(
      "INSERT INTO Transactions (UserID, UserCategoryID, Amount, Date, Description) VALUES (?, ?, ?, ?, ?)",
      [UserID, UserCategoryID, Amount, Date, Description]
    );
    return result.insertId;
  }

  // Create a Payment record using the TransactionID. 
  // Note: Removed Amount – instead using TransactionID to reference the corresponding transaction.
  static async createPayment(paymentData) {
    const { UserID, TransactionID, PaymentMethodID, PaymentDate } = paymentData;
    const [result] = await pool.query(
      "INSERT INTO Payments (UserID, TransactionID, PaymentMethodID, PaymentDate) VALUES (?, ?, ?, ?)",
      [UserID, TransactionID, PaymentMethodID, PaymentDate]
    );
    return result.insertId;
  }

  static async getByUserId(userId) {
    const [rows] = await pool.query(
      `SELECT t.*, c.Name AS CategoryName, c.Type AS CategoryType, pm.MethodName AS PaymentMethodName
       FROM Transactions t
       JOIN User_Categories uc ON t.UserCategoryID = uc.UserCategoryID
       JOIN Categories c ON uc.CategoryID = c.CategoryID
       JOIN Payments p ON p.TransactionID = t.TransactionID
       JOIN PaymentMethods pm ON p.PaymentMethodID = pm.PaymentMethodID
       WHERE t.UserID = ?
       ORDER BY t.Date DESC`,
      [userId]
    );
    return rows;
  }

  static async getRecentTransactions(userId, limit = 5) {
    const [rows] = await pool.query(
      `SELECT t.*, c.Name AS CategoryName, c.Type AS CategoryType, pm.MethodName AS PaymentMethodName
       FROM Transactions t
       JOIN User_Categories uc ON t.UserCategoryID = uc.UserCategoryID
       JOIN Categories c ON uc.CategoryID = c.CategoryID
       JOIN Payments p ON p.TransactionID = t.TransactionID
       JOIN PaymentMethods pm ON p.PaymentMethodID = pm.PaymentMethodID
       WHERE t.UserID = ?
       ORDER BY t.Date DESC
       LIMIT ?`,
      [userId, limit]
    );
    return rows;
  }

  static async getSummaryByCategory(userId) {
    const [rows] = await pool.query(
      `SELECT c.Name AS CategoryName, c.Type AS CategoryType,
              SUM(t.Amount) AS TotalAmount, COUNT(t.TransactionID) AS TransactionCount
       FROM Transactions t
       JOIN User_Categories uc ON t.UserCategoryID = uc.UserCategoryID
       JOIN Categories c ON uc.CategoryID = c.CategoryID
       WHERE t.UserID = ?
       GROUP BY c.Name, c.Type
       ORDER BY TotalAmount DESC`,
      [userId]
    );
    return rows;
  }

  static async delete(transactionId, userId) {
    const [result] = await pool.query(
      "DELETE FROM Transactions WHERE TransactionID = ? AND UserID = ?",
      [transactionId, userId]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Transaction;

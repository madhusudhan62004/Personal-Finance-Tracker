const pool = require("../config/db");

class Budget {
  static async create(budgetData) {
    const { UserID, UserCategoryID, LimitAmount, StartDate, EndDate } = budgetData;
    const [result] = await pool.query(
      "INSERT INTO Budgets (UserID, UserCategoryID, LimitAmount, StartDate, EndDate) VALUES (?, ?, ?, ?, ?)",
      [UserID, UserCategoryID, LimitAmount, StartDate, EndDate]
    );
    return result.insertId;
  }

  static async getByUserId(userId) {
    const [rows] = await pool.query(
      `SELECT b.*, c.Name as CategoryName,
        (SELECT SUM(t.Amount)
          FROM Transactions t
          JOIN Payments p ON p.TransactionID = t.TransactionID
          WHERE t.UserID = b.UserID
            AND t.UserCategoryID = b.UserCategoryID
            AND p.PaymentDate >= b.StartDate
            AND p.PaymentDate <= b.EndDate) as SpentAmount
      FROM Budgets b
      JOIN User_Categories uc ON b.UserCategoryID = uc.UserCategoryID
      JOIN Categories c ON uc.CategoryID = c.CategoryID
      WHERE b.UserID = ?`,
      [userId]
    );
    return rows;
  }

  static async getCurrentBudgets(userId) {
    const today = new Date().toISOString().slice(0, 10);
    const [rows] = await pool.query(
      `SELECT b.*, c.Name as CategoryName,
        (SELECT SUM(t.Amount)
          FROM Transactions t
          JOIN Payments p ON p.TransactionID = t.TransactionID
          WHERE t.UserID = b.UserID
            AND t.UserCategoryID = b.UserCategoryID
            AND p.PaymentDate >= b.StartDate
            AND p.PaymentDate <= b.EndDate) as SpentAmount
      FROM Budgets b
      JOIN User_Categories uc ON b.UserCategoryID = uc.UserCategoryID
      JOIN Categories c ON uc.CategoryID = c.CategoryID
      WHERE b.UserID = ? AND b.StartDate <= ? AND b.EndDate >= ?`,
      [userId, today, today]
    );
    return rows;
  }

  static async delete(budgetId, userId) {
    const [result] = await pool.query(
      "DELETE FROM Budgets WHERE BudgetID = ? AND UserID = ?",
      [budgetId, userId]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Budget;

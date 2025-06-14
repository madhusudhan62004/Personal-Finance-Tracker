const pool = require("../config/db");

class Goal {
  static async create(goalData) {
    const { UserID, Name, TargetAmount, CurrentAmount, Deadline } = goalData;
    const [result] = await pool.query(
      "INSERT INTO Goals (UserID, Name, TargetAmount, CurrentAmount, Deadline) VALUES (?, ?, ?, ?, ?)",
      [UserID, Name, TargetAmount, CurrentAmount || 0, Deadline]
    );
    return result.insertId;
  }

  static async getByUserId(userId) {
    const [rows] = await pool.query(
      "SELECT * FROM Goals WHERE UserID = ? ORDER BY Deadline ASC",
      [userId]
    );
    return rows;
  }

  static async update(goalId, userId, updateData) {
    const { Name, TargetAmount, CurrentAmount, Deadline, Status } = updateData;
    const [result] = await pool.query(
      `UPDATE Goals 
       SET Name = ?, TargetAmount = ?, CurrentAmount = ?, Deadline = ?, Status = ?
       WHERE GoalID = ? AND UserID = ?`,
      [Name, TargetAmount, CurrentAmount, Deadline, Status, goalId, userId]
    );
    return result.affectedRows > 0;
  }

  static async delete(goalId, userId) {
    const [result] = await pool.query(
      "DELETE FROM Goals WHERE GoalID = ? AND UserID = ?",
      [goalId, userId]
    );
    return result.affectedRows > 0;
  }
}

module.exports = Goal;
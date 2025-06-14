const mysql = require("mysql2/promise")
require("dotenv").config()

async function seed() {
  console.log("Starting database seeding...")

  // Create connection
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
  })

  try {
    // Create database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || "budget_buddy"}`)
    console.log(`Database ${process.env.DB_NAME || "budget_buddy"} created or already exists`)

    // Use the database
    await connection.query(`USE ${process.env.DB_NAME || "budget_buddy"}`)

    // Create tables
    console.log("Creating tables...")

    // Users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Users (
        UserID INT AUTO_INCREMENT PRIMARY KEY,
        Name VARCHAR(100) NOT NULL,
        Email VARCHAR(100) NOT NULL UNIQUE,
        Password VARCHAR(100) NOT NULL,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log("Users table created")

    // Categories table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Categories (
        CategoryID INT AUTO_INCREMENT PRIMARY KEY,
        Name VARCHAR(50) NOT NULL,
        Type ENUM('Income', 'Expense') NOT NULL,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log("Categories table created")

    // User_Categories table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS User_Categories (
        UserCategoryID INT AUTO_INCREMENT PRIMARY KEY,
        UserID INT NOT NULL,
        CategoryID INT NOT NULL,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
        FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID) ON DELETE CASCADE
      )
    `)
    console.log("User_Categories table created")

    // PaymentMethods table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS PaymentMethods (
        PaymentMethodID INT AUTO_INCREMENT PRIMARY KEY,
        MethodName VARCHAR(50) NOT NULL,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log("PaymentMethods table created")

    // Transactions table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Transactions (
        TransactionID INT AUTO_INCREMENT PRIMARY KEY,
        UserID INT NOT NULL,
        UserCategoryID INT NOT NULL,
        Amount DECIMAL(15, 2) NOT NULL,
        Date DATE NOT NULL,
        Description VARCHAR(255),
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
        FOREIGN KEY (UserCategoryID) REFERENCES User_Categories(UserCategoryID) ON DELETE CASCADE
      )
    `)
    console.log("Transactions table created")

    // Payments table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Payments (
        PaymentID INT AUTO_INCREMENT PRIMARY KEY,
        UserID INT NOT NULL,
        TransactionID INT NOT NULL,
        PaymentMethodID INT NOT NULL,
        PaymentDate DATE NOT NULL,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
        FOREIGN KEY (TransactionID) REFERENCES Transactions(TransactionID) ON DELETE CASCADE,
        FOREIGN KEY (PaymentMethodID) REFERENCES PaymentMethods(PaymentMethodID) ON DELETE CASCADE
      )
    `)
    console.log("Payments table created")

    // Budgets table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Budgets (
        BudgetID INT AUTO_INCREMENT PRIMARY KEY,
        UserID INT NOT NULL,
        UserCategoryID INT NOT NULL,
        LimitAmount DECIMAL(15, 2) NOT NULL,
        StartDate DATE NOT NULL,
        EndDate DATE NOT NULL,
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
        FOREIGN KEY (UserCategoryID) REFERENCES User_Categories(UserCategoryID) ON DELETE CASCADE
      )
    `)
    console.log("Budgets table created")

    // Goals table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Goals (
        GoalID INT AUTO_INCREMENT PRIMARY KEY,
        UserID INT NOT NULL,
        Name VARCHAR(100) NOT NULL,
        TargetAmount DECIMAL(15, 2) NOT NULL,
        CurrentAmount DECIMAL(15, 2) DEFAULT 0,
        Deadline DATE NOT NULL,
        Status VARCHAR(20) DEFAULT 'In Progress',
        CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
      )
    `)
    console.log("Goals table created")

    // Check if data already exists
    const [categories] = await connection.query("SELECT COUNT(*) as count FROM Categories")
    if (categories[0].count > 0) {
      console.log("Data already seeded, skipping seed data insertion")
      return
    }

    // Seed data
    console.log("Seeding data...")

    // Seed Categories
    const categoryData = [
      { Name: "Housing", Type: "Expense" },
      { Name: "Food", Type: "Expense" },
      { Name: "Transportation", Type: "Expense" },
      { Name: "Entertainment", Type: "Expense" },
      { Name: "Utilities", Type: "Expense" },
      { Name: "Shopping", Type: "Expense" },
      { Name: "Health", Type: "Expense" },
      { Name: "Education", Type: "Expense" },
      { Name: "Personal", Type: "Expense" },
      { Name: "Salary", Type: "Income" },
      { Name: "Freelance", Type: "Income" },
      { Name: "Investments", Type: "Income" },
      { Name: "Gifts", Type: "Income" },
    ]

    for (const category of categoryData) {
      await connection.query("INSERT INTO Categories (Name, Type) VALUES (?, ?)", [category.Name, category.Type])
    }
    console.log("Categories seeded")

    // Seed PaymentMethods
    const paymentMethodData = [
      { MethodName: "Cash" },
      { MethodName: "UPI" },
      { MethodName: "Credit Card" },
      { MethodName: "Debit Card" },
      { MethodName: "Net Banking" },
    ]

    for (const method of paymentMethodData) {
      await connection.query("INSERT INTO PaymentMethods (MethodName) VALUES (?)", [method.MethodName])
    }
    console.log("Payment Methods seeded")

    // Seed demo user
    const demoUser = {
      Name: "Demo User",
      Email: "demo@example.com",
      Password: "password123",
    }

    const [userResult] = await connection.query("INSERT INTO Users (Name, Email, Password) VALUES (?, ?, ?)", [
      demoUser.Name,
      demoUser.Email,
      demoUser.Password,
    ])
    const userId = userResult.insertId
    console.log("Demo user seeded")

    // Assign categories to demo user
    for (let i = 1; i <= categoryData.length; i++) {
      await connection.query("INSERT INTO User_Categories (UserID, CategoryID) VALUES (?, ?)", [userId, i])
    }
    console.log("User categories seeded")

    // Seed transactions for demo user
    const transactionData = [
      {
        UserCategoryID: 1, // Housing
        Amount: -15000,
        Date: "2023-11-03",
        Description: "Monthly Rent",
        PaymentMethodID: 5, // Net Banking
      },
      {
        UserCategoryID: 2, // Food
        Amount: -450,
        Date: "2023-11-02",
        Description: "Grocery Shopping",
        PaymentMethodID: 2, // UPI
      },
      {
        UserCategoryID: 3, // Transportation
        Amount: -350,
        Date: "2023-11-04",
        Description: "Uber Ride",
        PaymentMethodID: 2, // UPI
      },
      {
        UserCategoryID: 4, // Entertainment
        Amount: -800,
        Date: "2023-11-05",
        Description: "Movie Night",
        PaymentMethodID: 3, // Credit Card
      },
      {
        UserCategoryID: 6, // Shopping
        Amount: -2500,
        Date: "2023-11-01",
        Description: "New Clothes",
        PaymentMethodID: 3, // Credit Card
      },
      {
        UserCategoryID: 10, // Salary
        Amount: 50000,
        Date: "2023-11-01",
        Description: "Monthly Salary",
        PaymentMethodID: 5, // Net Banking
      },
      {
        UserCategoryID: 11, // Freelance
        Amount: 15000,
        Date: "2023-11-15",
        Description: "Website Project",
        PaymentMethodID: 2, // UPI
      },
    ]

    for (const transaction of transactionData) {
      const [transResult] = await connection.query(
        "INSERT INTO Transactions (UserID, UserCategoryID, Amount, Date, Description) VALUES (?, ?, ?, ?, ?)",
        [userId, transaction.UserCategoryID, transaction.Amount, transaction.Date, transaction.Description],
      )

      await connection.query(
        "INSERT INTO Payments (UserID, TransactionID, PaymentMethodID, PaymentDate) VALUES (?, ?, ?, ?)",
        [userId, transResult.insertId, transaction.PaymentMethodID, transaction.Date],
      )
    }
    console.log("Transactions seeded")

    // Seed budgets for demo user
    const budgetData = [
      {
        UserCategoryID: 1, // Housing
        LimitAmount: 15000,
        StartDate: "2023-11-01",
        EndDate: "2023-11-30",
      },
      {
        UserCategoryID: 2, // Food
        LimitAmount: 10000,
        StartDate: "2023-11-01",
        EndDate: "2023-11-30",
      },
      {
        UserCategoryID: 3, // Transportation
        LimitAmount: 5000,
        StartDate: "2023-11-01",
        EndDate: "2023-11-30",
      },
      {
        UserCategoryID: 4, // Entertainment
        LimitAmount: 3000,
        StartDate: "2023-11-01",
        EndDate: "2023-11-30",
      },
      {
        UserCategoryID: 5, // Utilities
        LimitAmount: 3000,
        StartDate: "2023-11-01",
        EndDate: "2023-11-30",
      },
    ]

    for (const budget of budgetData) {
      await connection.query(
        "INSERT INTO Budgets (UserID, UserCategoryID, LimitAmount, StartDate, EndDate) VALUES (?, ?, ?, ?, ?)",
        [userId, budget.UserCategoryID, budget.LimitAmount, budget.StartDate, budget.EndDate],
      )
    }
    console.log("Budgets seeded")

    // Seed goals for demo user
    const goalData = [
      {
        Name: "Emergency Fund",
        TargetAmount: 100000,
        CurrentAmount: 45000,
        Deadline: "2023-12-31",
        Status: "In Progress",
      },
      {
        Name: "New Laptop",
        TargetAmount: 80000,
        CurrentAmount: 30000,
        Deadline: "2024-03-15",
        Status: "In Progress",
      },
      {
        Name: "Vacation",
        TargetAmount: 150000,
        CurrentAmount: 25000,
        Deadline: "2024-06-30",
        Status: "In Progress",
      },
    ]

    for (const goal of goalData) {
      await connection.query(
        "INSERT INTO Goals (UserID, Name, TargetAmount, CurrentAmount, Deadline, Status) VALUES (?, ?, ?, ?, ?, ?)",
        [userId, goal.Name, goal.TargetAmount, goal.CurrentAmount, goal.Deadline, goal.Status],
      )
    }
    console.log("Goals seeded")

    console.log("Database seeding completed successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
  } finally {
    await connection.end()
  }
}

// Run the seed function
seed()

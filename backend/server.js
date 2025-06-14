require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const cors = require("cors");
const pool = require("./config/db");
const errorHandler = require("./utils/errorHandler");

// Import routes
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const goalRoutes = require("./routes/goalRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const paymentMethodRoutes = require("./routes/paymentMethodRoutes");

const app = express();

// Session store using MySQL
const sessionStore = new MySQLStore({}, pool);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:3000", // Must match your frontend URL
  credentials: true
}));

// Session configuration with sameSite set to "lax"
app.use(session({
  key: "budget_buddy_session",
  secret: process.env.SESSION_SECRET || "your_secret_key",
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 1 day (in ms)
    httpOnly: true,
    secure: false,  // Use true in production when using HTTPS
    sameSite: "lax", // This helps ensure the cookie is sent on cross-origin requests (from localhost:3000)
  }
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/payment-methods", paymentMethodRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

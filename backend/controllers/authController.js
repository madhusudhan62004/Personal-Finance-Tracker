const User = require("../models/User");
const { successResponse, errorResponse } = require("../utils/apiResponse");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);

    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    if (user.Password !== password) {
      return errorResponse(res, "Invalid credentials", 401);
    }

    // Simple session-based authentication:
    // Set the session userId and save the session
    req.session.userId = user.UserID;
    req.session.save();

    return successResponse(res, {
      message: "Login successful",
      user: {
        id: user.UserID,
        name: user.Name,
        email: user.Email
      }
    });
  } catch (error) {
    return errorResponse(res, "Login failed: " + error.message, 500);
  }
};

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findByEmail(email);

    if (existingUser) {
      return errorResponse(res, "Email already in use", 400);
    }

    // Create the new user
    const userId = await User.create({ Name: name, Email: email, Password: password });

    // Automatically log in the new user by setting the session userId
    req.session.userId = userId;
    req.session.save();

    return successResponse(
      res,
      {
        message: "User created and logged in successfully",
        user: {
          id: userId,
          name,
          email,
        },
      },
      201
    );
  } catch (error) {
    return errorResponse(res, "Signup failed: " + error.message, 500);
  }
};

const logout = (req, res) => {
  try {
    req.session.destroy();
    return successResponse(res, { message: "Logout successful" });
  } catch (error) {
    return errorResponse(res, "Logout failed: " + error.message, 500);
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      return errorResponse(res, "User not found", 404);
    }

    return successResponse(res, {
      user: {
        id: user.UserID,
        name: user.Name,
        email: user.Email
      }
    });
  } catch (error) {
    return errorResponse(res, "Failed to get user: " + error.message, 500);
  }
};

module.exports = {
  login,
  signup,
  logout,
  getCurrentUser
};

import axios from "axios";
import type { User, Transaction, Budget, Goal, Category, PaymentMethod } from "@/types/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Include cookies for session-based authentication
});

// Auth API
export const login = async (email: string, password: string): Promise<{ success: boolean; user: User }> => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

export const signup = async (name: string, email: string, password: string): Promise<{ success: boolean }> => {
  const response = await api.post("/auth/signup", { name, email, password });
  return response.data;
};

export const logout = async (): Promise<{ success: boolean }> => {
  const response = await api.post("/auth/logout");
  return response.data;
};

export const getCurrentUser = async (): Promise<{ success: boolean; user: User }> => {
  const response = await api.get("/auth/me");
  return response.data;
};

// Transactions API
// filepath: c:\Users\shrey\Downloads\budget-buddy\frontend\lib\api.ts
export const createTransaction = async (data: {
  amount: number;
  userCategoryID: number;
  paymentMethodID: number;
  date: string;
  description?: string;
}): Promise<{ success: boolean; transactionId: number }> => {
  const response = await api.post("/transactions", data);
  return response.data;
};

export const getTransactions = async (): Promise<{ success: boolean; transactions: Transaction[] }> => {
  const response = await api.get("/transactions");
  return response.data;
};

export const getRecentTransactions = async (): Promise<{ success: boolean; transactions: Transaction[] }> => {
  const response = await api.get("/transactions/recent");
  return response.data;
};

export const getTransactionSummary = async (): Promise<{ success: boolean; summary: any }> => {
  const response = await api.get("/transactions/summary");
  return response.data;
};

export const deleteTransaction = async (id: number): Promise<{ success: boolean }> => {
  const response = await api.delete(`/transactions/${id}`);
  return response.data;
};

// Budgets API
export const createBudget = async (data: {
  userCategoryID: number;
  limitAmount: number;
  startDate: string;
  endDate: string;
}): Promise<{ success: boolean; budget: Budget }> => {
  const response = await api.post("/budgets", data);
  return response.data;
};

export const getBudgets = async (): Promise<{ success: boolean; budgets: Budget[] }> => {
  const response = await api.get("/budgets");
  return response.data;
};

export const getCurrentBudgets = async (): Promise<{ success: boolean; budgets: Budget[] }> => {
  const response = await api.get("/budgets/current");
  return response.data;
};

export const deleteBudget = async (id: number): Promise<{ success: boolean }> => {
  const response = await api.delete(`/budgets/${id}`);
  return response.data;
};

// Goals API
export const createGoal = async (data: {
  name: string;
  targetAmount: number;
  deadline: string;
}): Promise<{ success: boolean; goal: Goal }> => {
  const response = await api.post("/goals", data);
  return response.data;
};

export const getGoals = async (): Promise<{ success: boolean; goals: Goal[] }> => {
  const response = await api.get("/goals");
  return response.data;
};

export const updateGoal = async (id: number, data: { currentAmount: number }): Promise<{ success: boolean; goal: Goal }> => {
  const response = await api.put(`/goals/${id}`, data);
  return response.data;
};

export const deleteGoal = async (id: number): Promise<{ success: boolean }> => {
  const response = await api.delete(`/goals/${id}`);
  return response.data;
};

// Categories API
export const getAllCategories = async (): Promise<{ success: boolean; categories: Category[] }> => {
  const response = await api.get("/categories");
  return response.data;
};

export const getUserCategories = async (): Promise<{ success: boolean; categories: Category[] }> => {
  const response = await api.get("/categories/user");
  if (!response.data.success || !response.data.categories) {
    throw new Error("Failed to fetch categories");
  }
  return response.data;
};

export const addUserCategory = async (categoryId: number): Promise<{ success: boolean }> => {
  const response = await api.post("/categories/user", { categoryId });
  return response.data;
};

// Payment Methods API
export const getAllPaymentMethods = async (): Promise<{ success: boolean; paymentMethods: PaymentMethod[] }> => {
  const response = await api.get("/payment-methods");
  if (!response.data.success || !response.data.paymentMethods) {
    throw new Error("Failed to fetch payment methods");
  }
  return response.data;
};

export const createPaymentMethod = async (methodName: string): Promise<{ success: boolean; paymentMethod: PaymentMethod }> => {
  const response = await api.post("/payment-methods", { methodName });
  return response.data;
};
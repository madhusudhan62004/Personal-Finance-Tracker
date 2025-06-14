export interface User {
    UserID: number
    Name: string
    Email: string
  }
  
  export interface Transaction {
    TransactionID: number
    UserID: number
    CategoryID: number
    PaymentMethodID: number
    Amount: number
    Date: string
    Description?: string
    CategoryName: string
    CategoryType: "Income" | "Expense"
    PaymentMethodName: string
  }
  
  export interface Category {
    CategoryID: number
    Name: string
    Type: "Income" | "Expense"
  }
  
  export interface UserCategory extends Category {
    UserID: number
  }
  
  export interface Budget {
    BudgetID: number
    UserID: number
    UserCategoryID: number
    LimitAmount: number
    SpentAmount: number
    StartDate: string
    EndDate: string
    CategoryName: string
  }
  
  export interface Goal {
    GoalID: number
    UserID: number
    Name: string
    TargetAmount: number
    CurrentAmount: number
    Deadline: string
    Status: "In Progress" | "Completed"
  }
  
  export interface PaymentMethod {
    PaymentMethodID: number
    MethodName: string
  }
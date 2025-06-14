"use client"

import { useState, useEffect } from "react"
import Layout from "@/components/layout/Layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useToast } from "@/contexts/ToastContext"
import { formatCurrency, calculatePercentage, getProgressColor } from "@/lib/utils"
import { getRecentTransactions, getTransactionSummary, getCurrentBudgets, getGoals } from "@/lib/api"
import { DollarSign, Plus, TrendingDown, TrendingUp } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import TransactionDialog from "@/components/dialogs/TransactionDialog"

export default function Dashboard() {
  const [recentTransactions, setRecentTransactions] = useState([])
  const [transactionSummary, setTransactionSummary] = useState([])
  const [currentBudgets, setCurrentBudgets] = useState([])
  const [goals, setGoals] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false)
  const { toast } = useToast()

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      const [transactionsRes, summaryRes, budgetsRes, goalsRes] = await Promise.all([
        getRecentTransactions(),
        getTransactionSummary(),
        getCurrentBudgets(),
        getGoals(),
      ])

      setRecentTransactions(transactionsRes.transactions || [])
      setTransactionSummary(summaryRes.summary || [])
      setCurrentBudgets(budgetsRes.budgets || [])
      setGoals(goalsRes.goals || [])
    } catch (error) {
      toast({
        title: "Error fetching dashboard data",
        description: "Please try again later",
        type: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Calculate total income and expenses
  const totalIncome = transactionSummary
    .filter((item: any) => item.CategoryType === "Income")
    .reduce((sum: number, item: any) => sum + Number(item.TotalAmount), 0)

  const totalExpenses = transactionSummary
    .filter((item: any) => item.CategoryType === "Expense")
    .reduce((sum: number, item: any) => sum + Math.abs(Number(item.TotalAmount)), 0)

  const balance = totalIncome - totalExpenses

  // Prepare data for charts
  const categoryData = transactionSummary
    .filter((item: any) => item.CategoryType === "Expense")
    .map((item: any) => ({
      name: item.CategoryName,
      value: Math.abs(Number(item.TotalAmount)),
    }))

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#FF6B6B"]

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <Button onClick={() => setIsTransactionDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
              <p className="text-xs text-muted-foreground">Your current balance</p>
            </CardContent>
          </Card>
          <Card className="border-green-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Income</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{formatCurrency(totalIncome)}</div>
              <p className="text-xs text-muted-foreground">Your total income</p>
            </CardContent>
          </Card>
          <Card className="border-red-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{formatCurrency(totalExpenses)}</div>
              <p className="text-xs text-muted-foreground">Your total expenses</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Expense by Category Chart */}
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle>Expenses by Category</CardTitle>
                  <CardDescription>Breakdown of your expenses by category</CardDescription>
                </CardHeader>
                <CardContent>
                  {categoryData.length > 0 ? (
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="flex h-[300px] items-center justify-center">
                      <p className="text-muted-foreground">No expense data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Income vs Expenses Chart */}
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle>Income vs Expenses</CardTitle>
                  <CardDescription>Comparison of your income and expenses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={[
                          { name: "Income", value: totalIncome },
                          { name: "Expenses", value: totalExpenses },
                        ]}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `₹${value / 1000}K`} />
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                        <Bar dataKey="value" fill="#8884d8">
                          <Cell fill="#4ade80" />
                          <Cell fill="#f87171" />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-4">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Your most recent transactions</CardDescription>
              </CardHeader>
              <CardContent>
                {recentTransactions.length > 0 ? (
                  <div className="space-y-4">
                    {recentTransactions.map((transaction: any) => (
                      <div
                        key={transaction.TransactionID}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`rounded-full p-2 ${transaction.CategoryType === "Income" ? "bg-green-500/20" : "bg-red-500/20"}`}
                          >
                            {transaction.CategoryType === "Income" ? (
                              <TrendingUp className="h-4 w-4 text-green-500" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{transaction.CategoryName}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(transaction.Date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`font-medium ${transaction.CategoryType === "Income" ? "text-green-500" : "text-red-500"}`}
                        >
                          {transaction.CategoryType === "Income" ? "+" : "-"}
                          {formatCurrency(Math.abs(Number(transaction.Amount)))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-40 items-center justify-center">
                    <p className="text-muted-foreground">No transactions found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Budgets Tab */}
          <TabsContent value="budgets" className="space-y-4">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Current Budgets</CardTitle>
                <CardDescription>Your active budget limits and spending</CardDescription>
              </CardHeader>
              <CardContent>
                {currentBudgets.length > 0 ? (
                  <div className="space-y-4">
                    {currentBudgets.map((budget: any) => {
                      const spentAmount = Number(budget.SpentAmount) || 0
                      const limitAmount = Number(budget.LimitAmount)
                      const percentage = calculatePercentage(spentAmount, limitAmount)

                      return (
                        <div key={budget.BudgetID} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{budget.CategoryName}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatCurrency(spentAmount)} of {formatCurrency(limitAmount)}
                              </p>
                            </div>
                            <p
                              className={`text-sm font-medium ${percentage > 90 ? "text-red-500" : percentage > 70 ? "text-yellow-500" : "text-green-500"}`}
                            >
                              {percentage}%
                            </p>
                          </div>
                          <Progress value={percentage} indicatorColor="bg-primary" />
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="flex h-40 items-center justify-center">
                    <p className="text-muted-foreground">No active budgets found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-4">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Savings Goals</CardTitle>
                <CardDescription>Track your progress towards financial goals</CardDescription>
              </CardHeader>
              <CardContent>
                {goals.length > 0 ? (
                  <div className="space-y-4">
                    {goals.map((goal: any) => {
                      const currentAmount = Number(goal.CurrentAmount)
                      const targetAmount = Number(goal.TargetAmount)
                      const percentage = calculatePercentage(currentAmount, targetAmount)

                      return (
                        <div key={goal.GoalID} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{goal.Name}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatCurrency(currentAmount)} of {formatCurrency(targetAmount)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{percentage}%</p>
                              <p className="text-xs text-muted-foreground">
                                Deadline: {new Date(goal.Deadline).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Progress value={percentage} indicatorColor="bg-primary" />
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="flex h-40 items-center justify-center">
                    <p className="text-muted-foreground">No savings goals found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <TransactionDialog
        open={isTransactionDialogOpen}
        onOpenChange={setIsTransactionDialogOpen}
        onSuccess={() => {
          fetchDashboardData()
          toast({
            title: "Transaction added successfully",
            type: "success",
          })
        }}
      />
    </Layout>
  )
}

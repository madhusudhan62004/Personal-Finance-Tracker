"use client"

import { useState, useEffect } from "react"
import Layout from "@/components/layout/Layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/contexts/ToastContext"
import { formatCurrency, calculatePercentage, getProgressColor } from "@/lib/utils"
import { Plus, Trash2 } from "lucide-react"
import BudgetDialog from "@/components/dialogs/BudgetDialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// IMPORTANT: Use the current budgets endpoint for updated spending info.
import { getCurrentBudgets, deleteBudget } from "@/lib/api"

export default function Budgets() {
  const [budgets, setBudgets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedBudget, setSelectedBudget] = useState<any>(null)
  const { toast } = useToast()

  const fetchBudgets = async () => {
    setIsLoading(true)
    try {
      // Use getCurrentBudgets to fetch budgets with up-to-date spent amounts.
      const response = await getCurrentBudgets()
      setBudgets(response.budgets || [])
    } catch (error) {
      toast({
        title: "Error fetching budgets",
        description: "Please try again later",
        type: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBudgets()
  }, [])

  const handleDeleteBudget = async () => {
    if (!selectedBudget) return

    try {
      await deleteBudget(selectedBudget.BudgetID)
      await fetchBudgets()
      toast({
        title: "Budget deleted successfully",
        type: "success",
      })
    } catch (error) {
      toast({
        title: "Error deleting budget",
        description: "Please try again later",
        type: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setSelectedBudget(null)
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
          <Button onClick={() => setIsBudgetDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Budget
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <Card className="col-span-full border-primary/20">
              <CardContent className="flex h-40 items-center justify-center">
                <p className="text-muted-foreground">Loading budgets...</p>
              </CardContent>
            </Card>
          ) : budgets.length > 0 ? (
            budgets.map((budget: any) => {
              const spentAmount = Number(budget.SpentAmount) || 0
              const limitAmount = Number(budget.LimitAmount)
              const percentage = calculatePercentage(spentAmount, limitAmount)

              return (
                <Card key={budget.BudgetID} className="border-primary/20">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle className="text-lg font-medium">{budget.CategoryName}</CardTitle>
                      <CardDescription>
                        {new Date(budget.StartDate).toLocaleDateString()} -{" "}
                        {new Date(budget.EndDate).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedBudget(budget)
                        setIsDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Budget Limit</span>
                        <span className="font-medium">{formatCurrency(limitAmount)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Spent</span>
                        <span className="font-medium">{formatCurrency(spentAmount)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Remaining</span>
                        <span className="font-medium">{formatCurrency(limitAmount - spentAmount)}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Progress</span>
                        <span
                          className={`text-sm font-medium ${percentage > 90 ? "text-red-500" : percentage > 70 ? "text-yellow-500" : "text-green-500"}`}
                        >
                          {percentage}%
                        </span>
                      </div>
                      <Progress value={percentage} indicatorColor="bg-primary" />
                    </div>
                  </CardContent>
                </Card>
              )
            })
          ) : (
            <Card className="col-span-full border-primary/20">
              <CardHeader>
                <CardTitle>No Budgets</CardTitle>
                <CardDescription>
                  You haven&apos;t created any budgets yet. Create a budget to start tracking your spending.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Button onClick={() => setIsBudgetDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Budget
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <BudgetDialog
        open={isBudgetDialogOpen}
        onOpenChange={setIsBudgetDialogOpen}
        onSuccess={() => {
          fetchBudgets()
          toast({
            title: "Budget created successfully",
            type: "success",
          })
        }}
      />

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Budget</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this budget? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteBudget}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  )
}

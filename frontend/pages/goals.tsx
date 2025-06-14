"use client"

import { useState, useEffect } from "react"
import Layout from "@/components/layout/Layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/contexts/ToastContext"
import { formatCurrency, calculatePercentage } from "@/lib/utils"
import { getGoals, deleteGoal, updateGoal } from "@/lib/api"
import { Calendar, Plus, Trash2 } from "lucide-react"
import GoalDialog from "@/components/dialogs/GoalDialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function Goals() {
  const [goals, setGoals] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<any>(null)
  const { toast } = useToast()

  const fetchGoals = async () => {
    setIsLoading(true)
    try {
      const response = await getGoals()
      setGoals(response.goals || [])
    } catch (error) {
      toast({
        title: "Error fetching goals",
        description: "Please try again later",
        type: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchGoals()
  }, [])

  const handleDeleteGoal = async () => {
    if (!selectedGoal) return

    try {
      await deleteGoal(selectedGoal.GoalID)
      await fetchGoals()
      toast({
        title: "Goal deleted successfully",
        type: "success",
      })
    } catch (error) {
      toast({
        title: "Error deleting goal",
        description: "Please try again later",
        type: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setSelectedGoal(null)
    }
  }

  const handleUpdateGoalStatus = async (goalId: number, status: string) => {
    try {
      const goal = goals.find((g: any) => g.GoalID === goalId)
      if (!goal) return

      await updateGoal(goalId, {
        ...goal,
        status,
      })

      await fetchGoals()
      toast({
        title: `Goal marked as ${status}`,
        type: "success",
      })
    } catch (error) {
      toast({
        title: "Error updating goal",
        description: "Please try again later",
        type: "destructive",
      })
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Savings Goals</h1>
          <Button onClick={() => setIsGoalDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Goal
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <Card className="col-span-full border-primary/20">
              <CardContent className="flex h-40 items-center justify-center">
                <p className="text-muted-foreground">Loading goals...</p>
              </CardContent>
            </Card>
          ) : goals.length > 0 ? (
            goals.map((goal: any) => {
              const currentAmount = Number(goal.CurrentAmount)
              const targetAmount = Number(goal.TargetAmount)
              const percentage = calculatePercentage(currentAmount, targetAmount)
              const isCompleted = goal.Status === "Completed"

              return (
                <Card key={goal.GoalID} className={`border-primary/20 ${isCompleted ? "bg-green-500/10" : ""}`}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle className="text-lg font-medium">{goal.Name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Deadline: {new Date(goal.Deadline).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedGoal(goal)
                        setIsDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Target Amount</span>
                        <span className="font-medium">{formatCurrency(targetAmount)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Current Amount</span>
                        <span className="font-medium">{formatCurrency(currentAmount)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Remaining</span>
                        <span className="font-medium">{formatCurrency(targetAmount - currentAmount)}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Progress</span>
                        <span className={`text-sm font-medium ${isCompleted ? "text-green-500" : ""}`}>
                          {percentage}%
                        </span>
                      </div>
                      <Progress value={percentage} indicatorColor={isCompleted ? "bg-green-500" : "bg-primary"} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Status</span>
                      <span className={`text-sm font-medium ${isCompleted ? "text-green-500" : "text-yellow-500"}`}>
                        {goal.Status}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-end gap-2">
                    {!isCompleted && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateGoalStatus(goal.GoalID, "Completed")}
                      >
                        Mark as Completed
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              )
            })
          ) : (
            <Card className="col-span-full border-primary/20">
              <CardHeader>
                <CardTitle>No Savings Goals</CardTitle>
                <CardDescription>
                  You haven&apos;t created any savings goals yet. Create a goal to start tracking your progress.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Button onClick={() => setIsGoalDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Goal
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <GoalDialog
        open={isGoalDialogOpen}
        onOpenChange={setIsGoalDialogOpen}
        onSuccess={() => {
          fetchGoals()
          toast({
            title: "Goal created successfully",
            type: "success",
          })
        }}
      />

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Goal</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this goal? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteGoal}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  )
}

"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createGoal } from "@/lib/api"
import { useToast } from "@/contexts/ToastContext"
import { Loader2 } from "lucide-react"

interface GoalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export default function GoalDialog({ open, onOpenChange, onSuccess }: GoalDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "",
    deadline: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split("T")[0],
  })

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      setFormData({
        name: "",
        targetAmount: "",
        currentAmount: "",
        deadline: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString().split("T")[0],
      })
    }
  }, [open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.targetAmount || !formData.deadline) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        type: "destructive",
      })
      return
    }

    if (new Date(formData.deadline) <= new Date()) {
      toast({
        title: "Invalid deadline",
        description: "Deadline must be in the future",
        type: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await createGoal({
        name: formData.name,
        targetAmount: Number.parseFloat(formData.targetAmount),
        currentAmount: formData.currentAmount ? Number.parseFloat(formData.currentAmount) : 0,
        deadline: formData.deadline,
      })

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error creating goal",
        description: "Please try again later",
        type: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Savings Goal</DialogTitle>
          <DialogDescription>Set a financial goal to track your savings progress</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="name">Goal Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g., Emergency Fund, New Laptop"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetAmount">Target Amount (₹)</Label>
            <Input
              id="targetAmount"
              name="targetAmount"
              type="number"
              placeholder="0.00"
              value={formData.targetAmount}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentAmount">Current Amount (₹) (Optional)</Label>
            <Input
              id="currentAmount"
              name="currentAmount"
              type="number"
              placeholder="0.00"
              value={formData.currentAmount}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline</Label>
            <Input id="deadline" name="deadline" type="date" value={formData.deadline} onChange={handleChange} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Goal"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
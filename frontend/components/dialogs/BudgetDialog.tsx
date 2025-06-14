"use client"

import { useState, useEffect } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getUserCategories, createBudget } from "@/lib/api"
import { useToast } from "@/contexts/ToastContext"
import { Loader2 } from "lucide-react"

interface BudgetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export default function BudgetDialog({ open, onOpenChange, onSuccess }: BudgetDialogProps) {
  const [userCategories, setUserCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState({
    userCategoryID: "",
    limitAmount: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split("T")[0],
  })

  const fetchUserCategories = async () => {
    setIsFetching(true)
    try {
      const response = await getUserCategories()
      // Filter to only show expense categories for budgets
      const expenseCategories = (response.categories || []).filter((cat: any) => cat.Type === "Expense")
      setUserCategories(expenseCategories)
    } catch (error) {
      toast({
        title: "Error fetching categories",
        description: "Please try again later",
        type: "destructive",
      })
    } finally {
      setIsFetching(false)
    }
  }

  useEffect(() => {
    if (open) {
      fetchUserCategories()
      // Reset form when dialog opens
      setFormData({
        userCategoryID: "",
        limitAmount: "",
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split("T")[0],
      })
    }
  }, [open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.userCategoryID || !formData.limitAmount || !formData.startDate || !formData.endDate) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        type: "destructive",
      })
      return
    }

    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      toast({
        title: "Invalid date range",
        description: "End date must be after start date",
        type: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await createBudget({
        userCategoryID: Number.parseInt(formData.userCategoryID),
        limitAmount: Number.parseFloat(formData.limitAmount),
        startDate: formData.startDate,
        endDate: formData.endDate,
      })

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error creating budget",
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
          <DialogTitle>Create Budget</DialogTitle>
          <DialogDescription>Set a spending limit for a specific category</DialogDescription>
        </DialogHeader>

        {isFetching ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="userCategoryID">Category</Label>
              <Select
                value={formData.userCategoryID}
                onValueChange={(value) => handleSelectChange("userCategoryID", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none" disabled>
                    Select a category
                  </SelectItem>
                  {userCategories.map((category: any) => (
                    <SelectItem key={category.CategoryID} value={category.CategoryID.toString()}>
                      {category.Name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="limitAmount">Budget Limit (₹)</Label>
              <Input
                id="limitAmount"
                name="limitAmount"
                type="number"
                placeholder="0.00"
                value={formData.limitAmount}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" name="startDate" type="date" value={formData.startDate} onChange={handleChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" name="endDate" type="date" value={formData.endDate} onChange={handleChange} />
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
                  "Create Budget"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
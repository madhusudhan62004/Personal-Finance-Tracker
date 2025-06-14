"use client"

import { useState, useEffect } from "react"
import Layout from "@/components/layout/Layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useToast } from "@/contexts/ToastContext"
import {
  getAllCategories,
  getUserCategories,
  addUserCategory,
  getAllPaymentMethods,
  createPaymentMethod,
} from "@/lib/api"
import { CreditCard, Plus, Tag } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function Customize() {
  const [allCategories, setAllCategories] = useState([])
  const [userCategories, setUserCategories] = useState([])
  const [paymentMethods, setPaymentMethods] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddPaymentMethodDialogOpen, setIsAddPaymentMethodDialogOpen] = useState(false)
  const [newPaymentMethodName, setNewPaymentMethodName] = useState("")
  const { toast } = useToast()

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [allCategoriesRes, userCategoriesRes, paymentMethodsRes] = await Promise.all([
        getAllCategories(),
        getUserCategories(),
        getAllPaymentMethods(),
      ])

      setAllCategories(allCategoriesRes.categories || [])
      setUserCategories(userCategoriesRes.categories || [])
      setPaymentMethods(paymentMethodsRes.paymentMethods || [])
    } catch (error) {
      toast({
        title: "Error fetching data",
        description: "Please try again later",
        type: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAddCategory = async (categoryId: number) => {
    try {
      await addUserCategory(categoryId)
      await fetchData()
      toast({
        title: "Category added successfully",
        type: "success",
      })
    } catch (error) {
      toast({
        title: "Error adding category",
        description: "Please try again later",
        type: "destructive",
      })
    }
  }

  const handleAddPaymentMethod = async () => {
    if (!newPaymentMethodName.trim()) {
      toast({
        title: "Payment method name is required",
        type: "destructive",
      })
      return
    }

    try {
      await createPaymentMethod(newPaymentMethodName)
      setNewPaymentMethodName("")
      setIsAddPaymentMethodDialogOpen(false)
      await fetchData()
      toast({
        title: "Payment method added successfully",
        type: "success",
      })
    } catch (error) {
      toast({
        title: "Error adding payment method",
        description: "Please try again later",
        type: "destructive",
      })
    }
  }

  // Get user category IDs for checking if a category is already added
  const userCategoryIds = userCategories.map((cat: any) => cat.CategoryID)

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Customize</h1>
        </div>

        <Tabs defaultValue="categories" className="space-y-4">
          <TabsList>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="space-y-4">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Your Categories</CardTitle>
                <CardDescription>Manage the categories you use for tracking income and expenses</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex h-40 items-center justify-center">
                    <p className="text-muted-foreground">Loading categories...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-3 text-lg font-medium">Income Categories</h3>
                      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                        {userCategories
                          .filter((cat: any) => cat.Type === "Income")
                          .map((category: any) => (
                            <div
                              key={category.CategoryID}
                              className="flex items-center gap-2 rounded-md border border-green-500/20 bg-green-500/10 p-3"
                            >
                              <Tag className="h-4 w-4 text-green-500" />
                              <span>{category.Name}</span>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-3 text-lg font-medium">Expense Categories</h3>
                      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                        {userCategories
                          .filter((cat: any) => cat.Type === "Expense")
                          .map((category: any) => (
                            <div
                              key={category.CategoryID}
                              className="flex items-center gap-2 rounded-md border border-red-500/20 bg-red-500/10 p-3"
                            >
                              <Tag className="h-4 w-4 text-red-500" />
                              <span>{category.Name}</span>
                            </div>
                          ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-3 text-lg font-medium">Available Categories</h3>
                      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                        {allCategories
                          .filter((cat: any) => !userCategoryIds.includes(cat.CategoryID))
                          .map((category: any) => (
                            <div
                              key={category.CategoryID}
                              className="flex items-center justify-between rounded-md border p-3"
                            >
                              <div className="flex items-center gap-2">
                                <Tag
                                  className={`h-4 w-4 ${category.Type === "Income" ? "text-green-500" : "text-red-500"}`}
                                />
                                <span>{category.Name}</span>
                              </div>
                              <Button variant="ghost" size="sm" onClick={() => handleAddCategory(category.CategoryID)}>
                                <Plus className="h-4 w-4" />
                                <span className="sr-only">Add</span>
                              </Button>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment-methods" className="space-y-4">
            <Card className="border-primary/20">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Payment Methods</CardTitle>
                  <CardDescription>Manage the payment methods you use for transactions</CardDescription>
                </div>
                <Button onClick={() => setIsAddPaymentMethodDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Method
                </Button>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex h-40 items-center justify-center">
                    <p className="text-muted-foreground">Loading payment methods...</p>
                  </div>
                ) : paymentMethods.length > 0 ? (
                  <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
                    {paymentMethods.map((method: any) => (
                      <div
                        key={method.PaymentMethodID}
                        className="flex items-center gap-2 rounded-md border border-primary/20 bg-primary/5 p-3"
                      >
                        <CreditCard className="h-4 w-4 text-primary" />
                        <span>{method.MethodName}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-40 items-center justify-center">
                    <p className="text-muted-foreground">No payment methods found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isAddPaymentMethodDialogOpen} onOpenChange={setIsAddPaymentMethodDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>Add a new payment method to use in your transactions</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="methodName">Method Name</Label>
              <Input
                id="methodName"
                placeholder="e.g., Credit Card, UPI, Cash"
                value={newPaymentMethodName}
                onChange={(e) => setNewPaymentMethodName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddPaymentMethodDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddPaymentMethod}>Add Payment Method</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  )
}

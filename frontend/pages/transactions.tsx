"use client"

import { useState, useEffect } from "react"
import Layout from "@/components/layout/Layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/contexts/ToastContext"
import { formatCurrency } from "@/lib/utils"
import { getTransactions, deleteTransaction } from "@/lib/api"
import { Plus, Search, TrendingDown, TrendingUp, Trash2 } from "lucide-react"
import TransactionDialog from "@/components/dialogs/TransactionDialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const { toast } = useToast()

  const fetchTransactions = async () => {
    setIsLoading(true)
    try {
      const response = await getTransactions()
      setTransactions(response.transactions || [])
      setFilteredTransactions(response.transactions || [])
    } catch (error) {
      toast({
        title: "Error fetching transactions",
        description: "Please try again later",
        type: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = transactions.filter(
        (transaction: any) =>
          transaction.CategoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.Description?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredTransactions(filtered)
    } else {
      setFilteredTransactions(transactions)
    }
  }, [searchTerm, transactions])

  const handleDeleteTransaction = async () => {
    if (!selectedTransaction) return

    try {
      await deleteTransaction(selectedTransaction.TransactionID)
      await fetchTransactions()
      toast({
        title: "Transaction deleted successfully",
        type: "success",
      })
    } catch (error) {
      toast({
        title: "Error deleting transaction",
        description: "Please try again later",
        type: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setSelectedTransaction(null)
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <Button onClick={() => setIsTransactionDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search transactions..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
            <CardDescription>View and manage all your financial transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex h-40 items-center justify-center">
                <p className="text-muted-foreground">Loading transactions...</p>
              </div>
            ) : filteredTransactions.length > 0 ? (
              <div className="space-y-4">
                {filteredTransactions.map((transaction: any) => (
                  <div
                    key={transaction.TransactionID}
                    className="flex items-center justify-between rounded-lg border p-4"
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
                        {transaction.Description && <p className="text-sm">{transaction.Description}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div
                        className={`font-medium ${transaction.CategoryType === "Income" ? "text-green-500" : "text-red-500"}`}
                      >
                        {transaction.CategoryType === "Income" ? "+" : "-"}
                        {formatCurrency(Math.abs(Number(transaction.Amount)))}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedTransaction(transaction)
                          setIsDeleteDialogOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                      </Button>
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
      </div>

      <TransactionDialog
        open={isTransactionDialogOpen}
        onOpenChange={setIsTransactionDialogOpen}
        onSuccess={() => {
          fetchTransactions()
          toast({
            title: "Transaction added successfully",
            type: "success",
          })
        }}
      />

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Transaction</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this transaction? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTransaction}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  )
}

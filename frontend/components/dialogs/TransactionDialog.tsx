"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getUserCategories, getAllPaymentMethods, createTransaction } from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";
import { Loader2 } from "lucide-react";

interface TransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function TransactionDialog({ open, onOpenChange, onSuccess }: TransactionDialogProps) {
  const [formData, setFormData] = useState({
    amount: "",
    userCategoryID: "",  // Updated key here
    paymentMethodID: "",
    date: "",
    description: "",
  });
  const [userCategories, setUserCategories] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      try {
        const [categoriesResponse, paymentMethodsResponse] = await Promise.all([
          getUserCategories(),
          getAllPaymentMethods(),
        ]);
        setUserCategories(categoriesResponse.categories);
        setPaymentMethods(paymentMethodsResponse.paymentMethods);
      } catch (error) {
        toast({
          title: "Error fetching data",
          description: "Could not load categories or payment methods",
          type: "destructive",
        });
      } finally {
        setIsFetching(false);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await createTransaction({
        amount: parseFloat(formData.amount),
        userCategoryID: parseInt(formData.userCategoryID),  // Updated payload property
        paymentMethodID: parseInt(formData.paymentMethodID),
        date: formData.date,
        description: formData.description,
      });
      toast({
        title: "Transaction added",
        description: "Your transaction has been successfully added",
        type: "success",
      });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error adding transaction",
        description: "Please try again later",
        type: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>Record a new income or expense transaction</DialogDescription>
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
                  {userCategories.map((category) => (
                    <SelectItem key={category.CategoryID} value={category.CategoryID.toString()}>
                      {category.Name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethodID">Payment Method</Label>
              <Select
                value={formData.paymentMethodID}
                onValueChange={(value) => handleSelectChange("paymentMethodID", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none" disabled>
                    Select a payment method
                  </SelectItem>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.PaymentMethodID} value={method.PaymentMethodID.toString()}>
                      {method.MethodName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                type="text"
                placeholder="Optional"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Transaction
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

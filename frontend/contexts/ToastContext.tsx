"use client"

import { createContext, useContext, useState } from "react"
import type { Toast, ToastContextType } from "@/types/toast"
import { ToastContainer } from "@/components/ui/toast"
import { v4 as uuidv4 } from "uuid"

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider2({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = ({ title, description, type = "default", duration = 5000 }: Omit<Toast, "id">) => {
    const id = uuidv4()
    const newToast: Toast = { id, title, description, type, duration }
    
    setToasts((currentToasts) => [...currentToasts, newToast])
    setTimeout(() => {
      setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id))
    }, duration)
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastContainer toasts={toasts} />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
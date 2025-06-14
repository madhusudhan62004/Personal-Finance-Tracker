export type ToastType = "default" | "success" | "destructive" | "warning"

export interface Toast {
  id: string
  title: string
  description?: string
  type?: ToastType
  duration?: number
}

export interface ToastContextType {
  toast: (toast: Omit<Toast, "id">) => void
}
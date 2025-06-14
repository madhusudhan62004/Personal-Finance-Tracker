import { useEffect, useState } from "react"
import type { Toast } from "@/types/toast"
import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle2, XCircle } from "lucide-react"

interface ToastContainerProps {
  toasts: Toast[]
}

export function ToastContainer({ toasts }: ToastContainerProps) {
  return (
    <div className="fixed bottom-0 right-0 z-50 m-4 flex flex-col items-end space-y-2">
      {toasts.map((toast) => (
        <ToastMessage key={toast.id} {...toast} />
      ))}
    </div>
  )
}

function ToastMessage({ title, description, type = "default" }: Toast) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 4800) // Slightly less than duration to allow for animation

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div
      className={cn(
        "animate-in slide-in-from-right-full fade-in flex w-96 items-start gap-4 rounded-lg border p-4 shadow-lg",
        {
          "bg-background text-foreground": type === "default",
          "border-destructive bg-destructive/10 text-destructive": type === "destructive",
          "border-green-500 bg-green-500/10 text-green-500": type === "success",
          "border-yellow-500 bg-yellow-500/10 text-yellow-500": type === "warning",
        }
      )}
    >
      {type === "destructive" && <XCircle className="h-5 w-5" />}
      {type === "success" && <CheckCircle2 className="h-5 w-5" />}
      {type === "warning" && <AlertCircle className="h-5 w-5" />}
      <div className="flex-1">
        <h3 className="font-medium">{title}</h3>
        {description && <p className="mt-1 text-sm opacity-90">{description}</p>}
      </div>
    </div>
  )
}
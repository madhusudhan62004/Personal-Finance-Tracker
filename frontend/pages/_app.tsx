"use client"

import { useEffect } from "react"
import type { AppProps } from "next/app"
import { AuthProvider } from "@/contexts/AuthContext"
import { ToastProvider2 } from "@/contexts/ToastContext"
import "@/globals.css"

export default function App({ Component, pageProps }: AppProps) {
  // Prevent scrollbar shift
  useEffect(() => {
    document.body.classList.add("overflow-y-scroll")
    return () => {
      document.body.classList.remove("overflow-y-scroll")
    }
  }, [])

  return (
    <AuthProvider>
      <ToastProvider2>
        <Component {...pageProps} />
      </ToastProvider2>
    </AuthProvider>
  )
}

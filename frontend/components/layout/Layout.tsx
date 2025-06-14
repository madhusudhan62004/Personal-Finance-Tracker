"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/router"
import { useAuth } from "@/contexts/AuthContext"
import Header from "./Header"
import Sidebar from "./Sidebar"
import { Loader2 } from "lucide-react"

interface LayoutProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export default function Layout({ children, requireAuth = true }: LayoutProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Check if the current route is login or signup
  const isAuthPage = router.pathname === "/login" || router.pathname === "/signup"

  // If loading, show loading spinner
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // If requireAuth is true and user is not logged in, redirect to login
  if (requireAuth && !user && !isAuthPage) {
    router.push("/login")
    return null
  }

  // If on auth page and user is logged in, redirect to dashboard
  if (isAuthPage && user) {
    router.push("/homepage")
    return null
  }

  // For login and signup pages, don't show header and sidebar
  if (isAuthPage) {
    return (
      <>
        <div className="accent-blue"></div>
        <div className="accent-green"></div>
        <main className="min-h-screen">{children}</main>
      </>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Background accents */}
      <div className="accent-blue"></div>
      <div className="accent-green"></div>
      
      <Header toggleSidebar={toggleSidebar} />
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="flex-1 md:ml-64">
          <div className="container mx-auto p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
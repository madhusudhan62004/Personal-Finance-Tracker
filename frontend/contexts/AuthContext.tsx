"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/router"
import { login as apiLogin, signup as apiSignup, logout as apiLogout, getCurrentUser } from "@/lib/api"
import type { User } from "@/types/api"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await getCurrentUser()
        if (response.success) {
          setUser(response.user)
        }
      } catch (error) {
        console.error("Not authenticated")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiLogin(email, password)
      if (response.success) {
        setUser(response.user)
        router.push("/homepage")
      }
    } catch (error: any) {
      setError(error.response?.data?.error || "Login failed")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiSignup(name, email, password)
      if (response.success) {
        router.push("/login")
      }
    } catch (error: any) {
      setError(error.response?.data?.error || "Signup failed")
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await apiLogout()
      setUser(null)
      router.push("/login")
    } catch (error: any) {
      setError(error.response?.data?.error || "Logout failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
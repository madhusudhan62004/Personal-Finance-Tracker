"use client"
import Link from "next/link"
import { useRouter } from "next/router"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogOut, Menu } from "lucide-react"

interface HeaderProps {
  toggleSidebar: () => void
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const { user, logout } = useAuth()
  const router = useRouter()

  return (
    <header
      style={{
        background: "repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 10px), black"
      }}
      className="sticky top-0 z-30 flex h-16 items-center justify-between border-b px-4 md:px-6 backdrop-blur-sm"
    >
      <div className="flex items-center gap-2 backdrop-blur-sm">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-3xl font-bold text-primary glow-text">Budget</span>
            <span className="text-3xl font-bold text-neon-green">Buddy</span>
          </div>
        </Link>
      </div>
      <div className="flex items-center gap-4 backdrop-blur-sm">
        {user ? (
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <div className="text-sm font-medium">{user.name}</div>
              <div className="text-xs text-muted-foreground">{user.email}</div>
            </div>
            <Avatar className="h-8 w-8 border border-primary">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" onClick={() => logout()}>
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => router.push("/login")}>
              Login
            </Button>
            <Button onClick={() => router.push("/signup")}>Sign Up</Button>
          </div>
        )}
      </div>
    </header>
  )
}

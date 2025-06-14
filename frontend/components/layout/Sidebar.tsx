"use client"
import Link from "next/link"
import { useRouter } from "next/router"
import { cn } from "@/lib/utils"
import { Home, BarChart3, Wallet, Target, Settings, X, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  isOpen: boolean
  toggleSidebar: () => void
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const router = useRouter()

  const navItems = [
    {
      name: "Home",
      href: "/homepage",
      icon: Home,
    },
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Transactions",
      href: "/transactions",
      icon: Wallet,
    },
    {
      name: "Budgets",
      href: "/budgets",
      icon: BarChart3,
    },
    {
      name: "Goals",
      href: "/goals",
      icon: Target,
    },
    {
      name: "Customize",
      href: "/customize",
      icon: Settings,
    },
  ]

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar with subtle repeating linear gradient pattern */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 border-r bg-card transition-transform duration-300 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          // Subtle pattern: 45deg diagonal lines with very low white opacity.
          "bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.05)_0,rgba(255,255,255,0.05)_1px,transparent_1px,transparent_10px)]"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4 bg-card/90">
          <Link href="/dashboard" className="flex items-center gap-1">
            <Home className="h-6 w-6 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-green-500 to-yellow-500 bg-clip-text text-transparent filter drop-shadow-lg">
              Budget Buddy
            </span>
          </Link>
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors backdrop-blur-sm",
                router.pathname === item.href
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "hover:bg-muted/80"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>
        {/* Footer block */}
        <div className="mt-auto p-4 border-t border-white/20 text-xs text-gray-400">
          Created by :<br />
          Madhusudhan M and Shreyas S Rao
        </div>
      </aside>
    </>
  )
}

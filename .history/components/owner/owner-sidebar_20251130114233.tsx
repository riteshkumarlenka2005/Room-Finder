"use client"

import { Home, Building2, CalendarCheck, Users, MessageSquare, User, BarChart3, LogOut, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"


interface OwnerSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const menuItems = [
  { id: "overview", label: "Dashboard", icon: Home },
  { id: "properties", label: "My Properties", icon: Building2 },
  { id: "bookings", label: "Bookings", icon: CalendarCheck },
  { id: "helpers", label: "Domestic Helpers", icon: Users },
  { id: "messages", label: "Messages", icon: MessageSquare, badge: 3 },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "profile", label: "Profile", icon: User },
]

export function OwnerSidebar({ activeTab, setActiveTab }: OwnerSidebarProps) {
  return (
    <div className="w-64 bg-background border-r h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b">
  <Link href="/" className="flex items-center gap-2 cursor-pointer">
    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
      <Home className="w-5 h-5 text-white" />
    </div>
    <span className="text-xl font-bold">
      Room<span className="text-blue-600">Finder</span>
    </span>
  </Link>
</div>


      {/* User Info */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/indian-professional-man.png" />
            <AvatarFallback className="bg-blue-100 text-blue-600">RK</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Rajesh Kumar</p>
            <p className="text-xs text-muted-foreground truncate">Property Owner</p>
          </div>
          <div className="h-2 w-2 bg-green-500 rounded-full" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              activeTab === item.id
                ? "bg-blue-50 text-blue-600 border border-blue-100"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && (
              <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">{item.badge}</span>
            )}
          </button>
        ))}
      </nav>

      <Separator />

      {/* Bottom Actions */}
      <div className="p-4 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

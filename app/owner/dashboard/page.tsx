"use client"

import { useState } from "react"
import { OwnerSidebar } from "@/components/owner/owner-sidebar"
import { DashboardOverview } from "@/components/owner/dashboard-overview"
import MyProperties from "@/components/owner/my-properties"
import { BookingsManagement } from "@/components/owner/bookings-management"
import { DomesticHelpers } from "@/components/owner/domestic-helpers"
import { MessagesInbox } from "@/components/owner/messages-inbox"
import { OwnerProfile } from "@/components/owner/owner-profile"
import { Analytics } from "@/components/owner/analytics"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link";

export default function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <DashboardOverview />
      case "properties":
        return <MyProperties />
      case "bookings":
        return <BookingsManagement />
      case "helpers":
        return <DomesticHelpers />
      case "messages":
        return <MessagesInbox />
      case "profile":
        return <OwnerProfile />
      case "analytics":
        return <Analytics />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <OwnerSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-[280px] border-none">
          <OwnerSidebar
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab)
              setSidebarOpen(false)
            }}
          />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-10 w-10 rounded-xl bg-gray-50 border border-gray-100"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </Button>
              <div className="min-w-0">
                <h1 className="text-lg lg:text-2xl font-black text-gray-900 truncate">
                  {activeTab === "overview" && "Dashboard Overview"}
                  {activeTab === "properties" && "My Properties"}
                  {activeTab === "bookings" && "Bookings Management"}
                  {activeTab === "helpers" && "Domestic Helpers"}
                  {activeTab === "messages" && "Messages"}
                  {activeTab === "profile" && "Profile Settings"}
                  {activeTab === "analytics" && "Analytics & Reports"}
                </h1>
                <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mt-1 hidden sm:block">
                  Manager Portal • Welcome back
                </p>
              </div>
            </div>

            {/* Desktop Quick Actions */}
            <div className="flex items-center gap-3 shrink-0">
              <Link href="/list-property">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-10 px-4 rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-95">
                  <span className="hidden sm:inline">+ Add Property</span>
                  <span className="sm:hidden">+ Add</span>
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto bg-gray-50/50">
          <div className="max-w-7xl mx-auto space-y-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}

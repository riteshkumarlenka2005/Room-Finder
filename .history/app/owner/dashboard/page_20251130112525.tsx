"use client"

import { useState } from "react"
import { OwnerSidebar } from "@/components/owner/owner-sidebar"
import { DashboardOverview } from "@/components/owner/dashboard-overview"
import { MyProperties } from "@/components/owner/my-properties"
import { BookingsManagement } from "@/components/owner/bookings-management"
import { DomesticHelpers } from "@/components/owner/domestic-helpers"
import { MessagesInbox } from "@/components/owner/messages-inbox"
import { OwnerProfile } from "@/components/owner/owner-profile"
import { Analytics } from "@/components/owner/analytics"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

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
        <SheetContent side="left" className="p-0 w-72">
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
        <header className="sticky top-0 z-10 bg-background border-b px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
              </Sheet>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-foreground">
                  {activeTab === "overview" && "Dashboard Overview"}
                  {activeTab === "properties" && "My Properties"}
                  {activeTab === "bookings" && "Bookings Management"}
                  {activeTab === "helpers" && "Domestic Helpers"}
                  {activeTab === "messages" && "Messages"}
                  {activeTab === "profile" && "Profile Settings"}
                  {activeTab === "analytics" && "Analytics & Reports"}
                </h1>
                <p className="text-sm text-muted-foreground hidden sm:block">Welcome back, Rajesh Kumar</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="hidden sm:flex bg-transparent">
                + Add Property
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                + Add Room
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">{renderContent()}</main>
      </div>
    </div>
  )
}

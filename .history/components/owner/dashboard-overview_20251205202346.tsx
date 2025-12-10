"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Building2, Users, IndianRupee, TrendingUp, Eye, Star, CalendarCheck, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link";

const stats = [
  {
    title: "Total Properties",
    value: "12",
    change: "+2 this month",
    icon: Building2,
    color: "blue",
  },
  {
    title: "Active Bookings",
    value: "28",
    change: "+5 this week",
    icon: CalendarCheck,
    color: "green",
  },
  {
    title: "Total Earnings",
    value: "₹2,45,000",
    change: "+12% from last month",
    icon: IndianRupee,
    color: "purple",
  },
  {
    title: "Total Views",
    value: "1,234",
    change: "+18% this week",
    icon: Eye,
    color: "orange",
  },
]

const recentBookings = [
  {
    id: 1,
    tenant: "Amit Sharma",
    property: "2BHK Apartment, Koramangala",
    status: "confirmed",
    date: "Dec 1, 2024",
    amount: "₹15,000/mo",
    avatar: "AS",
  },
  {
    id: 2,
    tenant: "Priya Patel",
    property: "Single Room, Indiranagar",
    status: "pending",
    date: "Nov 28, 2024",
    amount: "₹8,000/mo",
    avatar: "PP",
  },
  {
    id: 3,
    tenant: "Vikram Singh",
    property: "PG Room, HSR Layout",
    status: "confirmed",
    date: "Nov 25, 2024",
    amount: "₹6,500/mo",
    avatar: "VS",
  },
]

const recentInquiries = [
  {
    id: 1,
    name: "Neha Gupta",
    message: "Is the 2BHK in Whitefield still available?",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: 2,
    name: "Rahul Verma",
    message: "Can I schedule a visit for tomorrow?",
    time: "5 hours ago",
    unread: true,
  },
  {
    id: 3,
    name: "Sneha Reddy",
    message: "What are the amenities included?",
    time: "1 day ago",
    unread: false,
  },
]

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {stat.change}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-xl ${
                    stat.color === "blue"
                      ? "bg-blue-100"
                      : stat.color === "green"
                        ? "bg-green-100"
                        : stat.color === "purple"
                          ? "bg-purple-100"
                          : "bg-orange-100"
                  }`}
                >
                  <stat.icon
                    className={`h-5 w-5 ${
                      stat.color === "blue"
                        ? "text-blue-600"
                        : stat.color === "green"
                          ? "text-green-600"
                          : stat.color === "purple"
                            ? "text-purple-600"
                            : "text-orange-600"
                    }`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Link href="/list-property">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Building2 className="h-4 w-4 mr-2" />
              Add New Property
            </Button>
            </Link>
            
            <Link href="/maushi-services">
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Hire Domestic Helper
            </Button>
            </Link>
            
            <Button variant="outline">
              <Star className="h-4 w-4 mr-2" />
              View Reviews
            </Button>
            <Button variant="outline">
              <Clock className="h-4 w-4 mr-2" />
              Schedule Visit
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-lg">Recent Bookings</CardTitle>
              <CardDescription>Latest tenant bookings</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-blue-600">
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">{booking.avatar}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{booking.tenant}</p>
                  <p className="text-xs text-muted-foreground truncate">{booking.property}</p>
                </div>
                <div className="text-right">
                  <Badge
                    variant={booking.status === "confirmed" ? "default" : "secondary"}
                    className={
                      booking.status === "confirmed"
                        ? "bg-green-100 text-green-700 hover:bg-green-100"
                        : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                    }
                  >
                    {booking.status}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">{booking.amount}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Inquiries */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-lg">Recent Inquiries</CardTitle>
              <CardDescription>Messages from potential tenants</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-blue-600">
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentInquiries.map((inquiry) => (
              <div key={inquiry.id} className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                    {inquiry.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm">{inquiry.name}</p>
                    {inquiry.unread && <span className="h-2 w-2 bg-blue-600 rounded-full" />}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{inquiry.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{inquiry.time}</p>
                </div>
                <Button size="sm" variant="outline" className="shrink-0 bg-transparent">
                  Reply
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Property Performance</CardTitle>
          <CardDescription>Top performing properties this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { name: "2BHK Apartment, Koramangala", views: 245, inquiries: 12, occupancy: 95 },
              { name: "Single Room, Indiranagar", views: 189, inquiries: 8, occupancy: 100 },
              { name: "PG Room, HSR Layout", views: 156, inquiries: 6, occupancy: 85 },
            ].map((property, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border">
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{property.name}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" /> {property.views} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" /> {property.inquiries} inquiries
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Occupancy</span>
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${property.occupancy}%` }} />
                  </div>
                  <span className="text-sm font-medium">{property.occupancy}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

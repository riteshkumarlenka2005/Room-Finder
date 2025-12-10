"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, Phone, Mail, Calendar, MapPin, Check, X, IndianRupee, Eye } from "lucide-react"

const bookings = [
  {
    id: "BK001",
    tenant: {
      name: "Amit Sharma",
      email: "amit.sharma@email.com",
      phone: "+91 98765 43210",
      avatar: "AS",
    },
    property: "2BHK Apartment, Koramangala",
    checkIn: "Dec 1, 2024",
    checkOut: "Nov 30, 2025",
    rent: "₹15,000/mo",
    deposit: "₹30,000",
    status: "active",
    paymentStatus: "paid",
  },
  {
    id: "BK002",
    tenant: {
      name: "Priya Patel",
      email: "priya.patel@email.com",
      phone: "+91 98765 43211",
      avatar: "PP",
    },
    property: "Single Room, Indiranagar",
    checkIn: "Dec 5, 2024",
    checkOut: "Dec 4, 2025",
    rent: "₹8,000/mo",
    deposit: "₹16,000",
    status: "pending",
    paymentStatus: "pending",
  },
  {
    id: "BK003",
    tenant: {
      name: "Vikram Singh",
      email: "vikram.singh@email.com",
      phone: "+91 98765 43212",
      avatar: "VS",
    },
    property: "PG Room, HSR Layout",
    checkIn: "Nov 15, 2024",
    checkOut: "Nov 14, 2025",
    rent: "₹6,500/mo",
    deposit: "₹13,000",
    status: "active",
    paymentStatus: "paid",
  },
  {
    id: "BK004",
    tenant: {
      name: "Sneha Reddy",
      email: "sneha.reddy@email.com",
      phone: "+91 98765 43213",
      avatar: "SR",
    },
    property: "3BHK House, Whitefield",
    checkIn: "Jan 1, 2025",
    checkOut: "Dec 31, 2025",
    rent: "₹25,000/mo",
    deposit: "₹50,000",
    status: "upcoming",
    paymentStatus: "partial",
  },
  {
    id: "BK005",
    tenant: {
      name: "Rahul Verma",
      email: "rahul.verma@email.com",
      phone: "+91 98765 43214",
      avatar: "RV",
    },
    property: "Studio Apartment, MG Road",
    checkIn: "Oct 1, 2024",
    checkOut: "Sep 30, 2024",
    rent: "₹12,000/mo",
    deposit: "₹24,000",
    status: "completed",
    paymentStatus: "paid",
  },
]

export function BookingsManagement() {
  const [activeTab, setActiveTab] = useState("all")

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === "all") return true
    return b.status === activeTab
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Active</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>
      case "upcoming":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Upcoming</Badge>
      case "completed":
        return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">Completed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Paid</Badge>
      case "pending":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Pending</Badge>
      case "partial":
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Partial</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-2xl font-bold">28</p>
            <p className="text-sm text-muted-foreground">Total Bookings</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-green-600">18</p>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-yellow-600">5</p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-blue-600">5</p>
            <p className="text-sm text-muted-foreground">Upcoming</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search bookings..." className="pl-10" />
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <Card key={booking.id} className="border-0 shadow-sm">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Tenant Info */}
                <div className="flex items-start gap-4 flex-1">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-blue-100 text-blue-600">{booking.tenant.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{booking.tenant.name}</h3>
                      {getStatusBadge(booking.status)}
                      {getPaymentBadge(booking.paymentStatus)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {booking.property}
                    </p>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {booking.tenant.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {booking.tenant.email}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="flex flex-col sm:flex-row gap-4 lg:gap-8">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="text-sm flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {booking.checkIn} - {booking.checkOut}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Rent</p>
                    <p className="text-sm font-semibold text-blue-600 flex items-center gap-1">
                      <IndianRupee className="h-4 w-4" />
                      {booking.rent}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Booking ID</p>
                    <p className="text-sm font-mono">{booking.id}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 sm:self-center">
                  {booking.status === "pending" && (
                    <>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white gap-1">
                        <Check className="h-4 w-4" /> Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50 gap-1 bg-transparent"
                      >
                        <X className="h-4 w-4" /> Reject
                      </Button>
                    </>
                  )}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                        <Eye className="h-4 w-4" /> Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Booking Details</DialogTitle>
                        <DialogDescription>Booking ID: {booking.id}</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-16 w-16">
                            <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                              {booking.tenant.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-lg">{booking.tenant.name}</h3>
                            <p className="text-sm text-muted-foreground">{booking.tenant.email}</p>
                            <p className="text-sm text-muted-foreground">{booking.tenant.phone}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Property</p>
                            <p className="font-medium">{booking.property}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Monthly Rent</p>
                            <p className="font-medium">{booking.rent}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Security Deposit</p>
                            <p className="font-medium">{booking.deposit}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Status</p>
                            {getStatusBadge(booking.status)}
                          </div>
                          <div>
                            <p className="text-muted-foreground">Check-in</p>
                            <p className="font-medium">{booking.checkIn}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Check-out</p>
                            <p className="font-medium">{booking.checkOut}</p>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline">Contact Tenant</Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">Download Agreement</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

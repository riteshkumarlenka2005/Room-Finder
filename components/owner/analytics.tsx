"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, Users, IndianRupee, Building2, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const earningsData = [
  { month: "Jun", earnings: 180000 },
  { month: "Jul", earnings: 195000 },
  { month: "Aug", earnings: 210000 },
  { month: "Sep", earnings: 225000 },
  { month: "Oct", earnings: 235000 },
  { month: "Nov", earnings: 245000 },
]

const viewsData = [
  { day: "Mon", views: 145 },
  { day: "Tue", views: 210 },
  { day: "Wed", views: 185 },
  { day: "Thu", views: 290 },
  { day: "Fri", views: 325 },
  { day: "Sat", views: 275 },
  { day: "Sun", views: 195 },
]

const propertyTypeData = [
  { name: "Apartments", value: 5, color: "#3b82f6" },
  { name: "Rooms", value: 4, color: "#22c55e" },
  { name: "PG", value: 2, color: "#f59e0b" },
  { name: "Houses", value: 1, color: "#8b5cf6" },
]

const topProperties = [
  { name: "2BHK Apartment, Koramangala", views: 245, inquiries: 12, bookings: 8, revenue: "₹1,20,000" },
  { name: "Single Room, Indiranagar", views: 189, inquiries: 8, bookings: 6, revenue: "₹48,000" },
  { name: "3BHK House, Whitefield", views: 312, inquiries: 15, bookings: 5, revenue: "₹1,25,000" },
  { name: "PG Room, HSR Layout", views: 156, inquiries: 6, bookings: 4, revenue: "₹26,000" },
]

export function Analytics() {
  return (
    <div className="space-y-6">
      {/* Time Filter */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Performance Overview</h2>
          <p className="text-sm text-muted-foreground">Track your properties' performance over time</p>
        </div>
        <Tabs defaultValue="6m">
          <TabsList>
            <TabsTrigger value="7d">7 Days</TabsTrigger>
            <TabsTrigger value="1m">1 Month</TabsTrigger>
            <TabsTrigger value="6m">6 Months</TabsTrigger>
            <TabsTrigger value="1y">1 Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total Revenue",
            value: "₹2,45,000",
            change: "+12%",
            trend: "up",
            icon: IndianRupee,
            color: "blue",
          },
          {
            title: "Total Views",
            value: "1,625",
            change: "+18%",
            trend: "up",
            icon: Eye,
            color: "green",
          },
          {
            title: "Inquiries",
            value: "41",
            change: "+8%",
            trend: "up",
            icon: Users,
            color: "purple",
          },
          {
            title: "Occupancy Rate",
            value: "85%",
            change: "-3%",
            trend: "down",
            icon: Building2,
            color: "orange",
          },
        ].map((metric) => (
          <Card key={metric.title} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <div
                    className={`flex items-center gap-1 text-sm ${
                      metric.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {metric.trend === "up" ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                    {metric.change} vs last month
                  </div>
                </div>
                <div
                  className={`p-3 rounded-xl ${
                    metric.color === "blue"
                      ? "bg-blue-100"
                      : metric.color === "green"
                        ? "bg-green-100"
                        : metric.color === "purple"
                          ? "bg-purple-100"
                          : "bg-orange-100"
                  }`}
                >
                  <metric.icon
                    className={`h-5 w-5 ${
                      metric.color === "blue"
                        ? "text-blue-600"
                        : metric.color === "green"
                          ? "text-green-600"
                          : metric.color === "purple"
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

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Chart */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly earnings from all properties</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                earnings: {
                  label: "Earnings",
                  color: "#3b82f6",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={earningsData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value / 1000}k`} />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    formatter={(value) => [`₹${value.toLocaleString()}`, "Earnings"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="earnings"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Views Chart */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Weekly Views</CardTitle>
            <CardDescription>Property views in the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                views: {
                  label: "Views",
                  color: "#22c55e",
                },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={viewsData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="views" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Property Distribution and Top Properties */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Property Distribution */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Property Distribution</CardTitle>
            <CardDescription>Types of properties you own</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={propertyTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {propertyTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [value, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {propertyTypeData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-muted-foreground">
                    {item.name} ({item.value})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Properties */}
        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle>Top Performing Properties</CardTitle>
            <CardDescription>Properties with highest engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProperties.map((property, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                      {index + 1}
                    </div>
                    <p className="font-medium truncate">{property.name}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Eye className="h-4 w-4" /> {property.views}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Users className="h-4 w-4" /> {property.inquiries}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-4 w-4" /> {property.bookings}
                    </span>
                    <Badge className="bg-green-100 text-green-700">{property.revenue}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Options */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="font-semibold">Export Reports</h3>
              <p className="text-sm text-muted-foreground">Download detailed analytics reports</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">Export as CSV</Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Export as PDF</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

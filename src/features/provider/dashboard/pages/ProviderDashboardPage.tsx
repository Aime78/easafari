import {
  Home,
  Mountain,
  Calendar,
  Package,
  DollarSign,
  Clock,
  Plus,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "../components/StatCard";

const ProviderDashboardPage = () => {
  // Dummy stats data
  const stats = [
    {
      icon: Home,
      label: "Total Accommodations",
      value: "12",
      change: "+2 this month",
    },
    {
      icon: Mountain,
      label: "Total Experiences",
      value: "8",
      change: "+1 this month",
    },
    {
      icon: Calendar,
      label: "Total Events",
      value: "5",
      change: "No change",
    },
    {
      icon: Package,
      label: "Total Bookings",
      value: "45",
      change: "+12% this month",
    },
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: "$12,450",
      change: "+8% this month",
    },
    {
      icon: Clock,
      label: "Pending Bookings",
      value: "7",
      change: "",
    },
  ];

  // Dummy revenue data
  const revenueData = [
    { label: "Total Revenue", value: "$12,450" },
    { label: "Confirmed", value: "$8,200" },
    { label: "Pending", value: "$4,250" },
    { label: "Service Fees", value: "$1,245" },
  ];

  // Dummy recent bookings
  const recentBookings = [
    {
      id: 1,
      guest: "John Doe",
      type: "Accommodation",
      date: "2025-10-20",
      checkIn: "2025-10-25",
      status: "confirmed",
      amount: "$450",
    },
    {
      id: 2,
      guest: "Jane Smith",
      type: "Experience",
      date: "2025-10-21",
      checkIn: "2025-10-27",
      status: "pending",
      amount: "$120",
    },
    {
      id: 3,
      guest: "Mike Johnson",
      type: "Accommodation",
      date: "2025-10-22",
      checkIn: "2025-11-01",
      status: "confirmed",
      amount: "$680",
    },
    {
      id: 4,
      guest: "Sarah Williams",
      type: "Experience",
      date: "2025-10-23",
      checkIn: "2025-10-30",
      status: "pending",
      amount: "$95",
    },
    {
      id: 5,
      guest: "David Brown",
      type: "Accommodation",
      date: "2025-10-24",
      checkIn: "2025-11-05",
      status: "confirmed",
      amount: "$520",
    },
  ];

  // Dummy upcoming events
  const upcomingEvents = [
    {
      id: 1,
      name: "Safari Adventure Tour",
      startDate: "2025-11-01",
      endDate: "2025-11-03",
      location: "Serengeti National Park",
      status: "active",
    },
    {
      id: 2,
      name: "Mountain Hiking Experience",
      startDate: "2025-11-10",
      endDate: "2025-11-12",
      location: "Mount Kilimanjaro",
      status: "active",
    },
    {
      id: 3,
      name: "Cultural Festival",
      startDate: "2025-11-15",
      endDate: "2025-11-17",
      location: "Arusha City Center",
      status: "active",
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      confirmed: "default",
      pending: "secondary",
      completed: "outline",
      cancelled: "destructive",
    };
    return (
      <Badge variant={variants[status] || "outline"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here's what's happening with your business.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Revenue Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {revenueData.map((item, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">{item.label}</p>
                <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Bookings</CardTitle>
          <Link to="/provider/bookings">
            <Button variant="ghost" size="sm">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Guest Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Booking Date</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.guest}</TableCell>
                  <TableCell>{booking.type}</TableCell>
                  <TableCell>{booking.date}</TableCell>
                  <TableCell>{booking.checkIn}</TableCell>
                  <TableCell>{getStatusBadge(booking.status)}</TableCell>
                  <TableCell className="text-right font-semibold">
                    {booking.amount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/provider/accommodations">
              <Button className="w-full" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Accommodation
              </Button>
            </Link>
            <Link to="/provider/experiences">
              <Button className="w-full" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Experience
              </Button>
            </Link>
            <Link to="/provider/events">
              <Button className="w-full" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </Link>
            <Link to="/provider/bookings">
              <Button className="w-full" variant="outline">
                <Package className="mr-2 h-4 w-4" />
                View All Bookings
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Upcoming Events</CardTitle>
          <Link to="/provider/events">
            <Button variant="ghost" size="sm">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{event.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {event.startDate} to {event.endDate}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{event.location}</p>
                </div>
                <Badge variant="default">{event.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderDashboardPage;

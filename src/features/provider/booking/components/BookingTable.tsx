import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  SearchX,
  Calendar,
  Users,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getImageUrl } from "@/lib/imageUtils";
import type { Booking } from "../types/bookingTypes";

interface BookingTableProps {
  bookings: Booking[];
}

const ExperienceBookingTable = ({ bookings }: BookingTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Format date range helper
  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
    };

    if (start.getFullYear() !== new Date().getFullYear()) {
      options.year = "numeric";
    }

    return `${start.toLocaleDateString(
      "en-US",
      options
    )} - ${end.toLocaleDateString("en-US", options)}`;
  };

  // Format guest count
  const formatGuestCount = (adults: number, child: number, infant: number) => {
    const total = adults + child + infant;
    if (total === 0) return "No guests";

    const parts = [];
    if (adults > 0) parts.push(`${adults} adult${adults > 1 ? "s" : ""}`);
    if (child > 0) parts.push(`${child} child${child > 1 ? "ren" : ""}`);
    if (infant > 0) parts.push(`${infant} infant${infant > 1 ? "s" : ""}`);

    return parts.join(", ");
  };

  // Get status badge color
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"; // Yellow/Orange
      case "confirmed":
        return "default"; // Blue
      case "completed":
        return "outline"; // Green
      case "cancelled":
        return "destructive"; // Red
      case "refunded":
        return "secondary"; // Gray
      default:
        return "secondary";
    }
  };

  // Filter and search logic
  const getFilteredBookings = () => {
    let filtered = bookings;

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    // Apply payment method filter
    if (paymentMethodFilter !== "all") {
      filtered = filtered.filter(
        (booking) => booking.payment_method === paymentMethodFilter
      );
    }

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (booking) =>
          booking.experience.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          booking.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const filteredBookings = getFilteredBookings();
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBookings = filteredBookings.slice(startIndex, endIndex);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  // Empty state component (following consistent pattern)
  const EmptyState = () => {
    const isFiltered =
      searchTerm.trim() ||
      statusFilter !== "all" ||
      paymentMethodFilter !== "all";
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          {isFiltered ? (
            <SearchX className="w-12 h-12 text-gray-400" />
          ) : (
            <Calendar className="w-12 h-12 text-gray-400" />
          )}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {isFiltered ? "No bookings found" : "No bookings yet"}
        </h3>
        <p className="text-gray-500 text-center max-w-sm mb-6">
          {isFiltered
            ? "No bookings match your current filters. Try adjusting your search or filter criteria."
            : "You don't have any experience bookings yet. Bookings will appear here once customers book your experiences."}
        </p>
        {isFiltered && (
          <div className="flex gap-2">
            {searchTerm.trim() && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSearch("")}
              >
                Clear Search
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="p-6 border-none shadow-none">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Experience Bookings
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
        <div className="flex gap-2">
          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>

          {/* Payment Method Filter */}
          <Select
            value={paymentMethodFilter}
            onValueChange={setPaymentMethodFilter}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Payment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="Momo">Mobile Money</SelectItem>
              <SelectItem value="Card">Card</SelectItem>
              <SelectItem value="Bank">Bank Transfer</SelectItem>
            </SelectContent>
          </Select>

          {/* Export button */}
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Table */}
      {currentBookings.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <ScrollArea className="xl:w-[1150px]">
            <Table>
              <TableHeader className="bg-gray-100 rounded-t-md">
                <TableRow>
                  <TableHead>Experience</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Guests</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payment Method</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentBookings.map((booking) => (
                  <TableRow key={booking.id}>
                    {/* Experience */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {booking.experience.thumbnail ? (
                          <img
                            src={getImageUrl(booking.experience.thumbnail)}
                            alt={booking.experience.name}
                            className="w-12 h-12 object-cover rounded-md"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                            <Calendar className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 truncate">
                            {booking.experience.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {booking.experience.address}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Customer */}
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">
                          {booking.user.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {booking.user.email}
                        </p>
                        <p className="text-sm text-gray-500">
                          {booking.user.phone}
                        </p>
                      </div>
                    </TableCell>

                    {/* Dates */}
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium">
                          {formatDateRange(
                            booking.start_date,
                            booking.end_date
                          )}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {booking.experience.duration}
                      </p>
                    </TableCell>

                    {/* Guests */}
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">
                          {formatGuestCount(
                            booking.adults,
                            booking.child,
                            booking.infant
                          )}
                        </span>
                      </div>
                    </TableCell>

                    {/* Status */}
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(booking.status)}>
                        {booking.status}
                      </Badge>
                    </TableCell>

                    {/* Amount */}
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">
                          ${booking.total}
                        </p>
                        <p className="text-xs text-gray-500">
                          (inc. ${booking.service_fee} fee)
                        </p>
                      </div>
                    </TableCell>

                    {/* Payment Method */}
                    <TableCell>
                      <span className="text-sm text-gray-900">
                        {booking.payment_method}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4 px-6 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Rows per page</p>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent side="top">
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, filteredBookings.length)} of{" "}
                  {filteredBookings.length} results
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                  >
                    <span className="sr-only">Go to first page</span>
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <span className="sr-only">Go to previous page</span>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <span className="sr-only">Go to next page</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    className="hidden h-8 w-8 p-0 lg:flex"
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    <span className="sr-only">Go to last page</span>
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
};

export default ExperienceBookingTable;

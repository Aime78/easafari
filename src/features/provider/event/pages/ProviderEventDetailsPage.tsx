import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ArrowLeft,
  MapPin,
  Users,
  DollarSign,
  Phone,
  Calendar,
  User,
  Plus,
  Ticket,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProviderEvent } from "../hooks/useProviderEvent";
import { getImageUrl, getFallbackImageUrl } from "@/lib/imageUtils";
import type { Event } from "../types/eventTypes";
import { format } from "date-fns";
import EventDetailsSkeleton from "../components/EventDetailsSkeleton";

const ProviderEventDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Ticket creation state
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [ticketForm, setTicketForm] = useState({
    name: "",
    price: "",
    quantity: "",
  });

  // Image error state
  const [imageError, setImageError] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const {
    data: eventData,
    isLoading,
    error,
  } = useProviderEvent(id!) as {
    data: Event | undefined;
    isLoading: boolean;
    error: Error | null;
  };

  // Reset image errors when event data changes
  useEffect(() => {
    if (eventData) {
      setImageError(false);
      setAvatarError(false);
    }
  }, [eventData]);

  if (isLoading) {
    return <EventDetailsSkeleton />;
  }

  if (error || !eventData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading event details</p>
          <p className="text-gray-600 text-sm">Please try again later.</p>
          <Button
            variant="outline"
            onClick={() => navigate("/provider/events")}
            className="mt-4"
          >
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  const event = eventData;

  const handleBackClick = () => {
    navigate("/provider/events");
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy");
  };

  const calculateDuration = () => {
    const start = new Date(event.start_date);
    const end = new Date(event.end_date);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return "1 day";
    } else if (diffDays > 1) {
      return `${diffDays} days`;
    } else {
      return "Same day";
    }
  };

  const getAvailabilityStatus = () => {
    const totalSeats = event.total_seats || 0;
    // Since we don't have available_spots, we'll just show if it's active
    if (event.is_active && totalSeats > 0) {
      return { status: "Available", color: "default" };
    } else if (event.is_active) {
      return { status: "Available", color: "default" };
    } else {
      return { status: "Inactive", color: "secondary" };
    }
  };

  const availability = getAvailabilityStatus();

  // Ticket management functions
  const handleCreateTicket = () => {
    // Here you would typically call an API to create the ticket
    console.log("Creating ticket:", ticketForm);
    // Reset form and hide create section
    setTicketForm({ name: "", price: "", quantity: "" });
    setShowCreateTicket(false);
  };

  const handleTicketFormChange = (field: string, value: string) => {
    setTicketForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Mock tickets data - replace with real data from API
  const mockTickets = [
    {
      event_id: event.id,
      name: "General Admission",
      price: "20",
      quantity: "100",
      remaining: "100",
      is_active: "1",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackClick}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Events</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                {!imageError ? (
                  <img
                    src={
                      event.thumbnail
                        ? getImageUrl(event.thumbnail)
                        : getFallbackImageUrl()
                    }
                    alt={event.name}
                    onError={() => {
                      console.log("Image failed to load, showing fallback");
                      setImageError(true);
                    }}
                    className="w-full sm:w-48 h-48 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full sm:w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 mb-2">
                        Image not available
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setImageError(false)}
                        className="text-xs"
                      >
                        Retry
                      </Button>
                    </div>
                  </div>
                )}
                <div className="flex-1 space-y-3">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {event.name}
                    </h1>
                    <div className="flex items-center space-x-2 mt-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">{event.location}</span>
                    </div>
                  </div>

                  {/* Rating section removed as not available in API */}

                  <div className="flex items-center space-x-4">
                    {event.price && (
                      <div className="flex items-center space-x-1">
                        <span className="text-2xl font-bold text-green-600">
                          ${event.price}
                        </span>
                        <span className="text-gray-500">per person</span>
                      </div>
                    )}

                    <Badge
                      variant={
                        availability.color === "default"
                          ? "default"
                          : availability.color === "destructive"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {availability.status}
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">
                      Organized by:{" "}
                      <strong>{event.tour_provider?.name || "N/A"}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Event Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Event Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                      <Calendar className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Start Date
                      </p>
                      <p className="font-semibold">
                        {formatDate(event.start_date)}
                      </p>
                    </div>
                  </div>
                  {/* Start time not available in API */}
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
                      <Calendar className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        End Date
                      </p>
                      <p className="font-semibold">
                        {formatDate(event.end_date)}
                      </p>
                    </div>
                  </div>
                  {/* End time not available in API */}
                </div>
              </div>
              <Separator className="my-4" />
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Duration:</span>
                <span className="font-semibold">{calculateDuration()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Ticket Management */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5" />
                Event Tickets
              </CardTitle>
              <Button
                onClick={() => setShowCreateTicket(!showCreateTicket)}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Ticket
              </Button>
            </CardHeader>
            <CardContent>
              {/* Create Ticket Form */}
              {showCreateTicket && (
                <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                  <h3 className="font-medium mb-4">Create New Ticket</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="ticket-name">Name</Label>
                      <Input
                        id="ticket-name"
                        placeholder="e.g. General Admission"
                        value={ticketForm.name}
                        onChange={(e) =>
                          handleTicketFormChange("name", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="ticket-price">Price</Label>
                      <Input
                        id="ticket-price"
                        placeholder="20"
                        type="number"
                        value={ticketForm.price}
                        onChange={(e) =>
                          handleTicketFormChange("price", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="ticket-quantity">Quantity</Label>
                      <Input
                        id="ticket-quantity"
                        placeholder="100"
                        type="number"
                        value={ticketForm.quantity}
                        onChange={(e) =>
                          handleTicketFormChange("quantity", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowCreateTicket(false)}
                      size="sm"
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleCreateTicket} size="sm">
                      Create Ticket
                    </Button>
                  </div>
                </div>
              )}

              {/* Tickets Table */}
              <div className="space-y-4">
                <h3 className="font-medium">Current Tickets</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Remaining</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTickets.map((ticket, index) => (
                      <TableRow key={index}>
                        <TableCell>{ticket.event_id}</TableCell>
                        <TableCell className="font-medium">
                          {ticket.name}
                        </TableCell>
                        <TableCell>${ticket.price}</TableCell>
                        <TableCell>{ticket.quantity}</TableCell>
                        <TableCell>{ticket.remaining}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              ticket.is_active === "1" ? "default" : "secondary"
                            }
                          >
                            {ticket.is_active === "1" ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    {mockTickets.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center text-gray-500"
                        >
                          No tickets created yet. Create your first ticket
                          above.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Event Description */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium mb-2">About This Event</h3>
                <p className="text-gray-700 leading-relaxed">
                  {event.description || "No description available."}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Features and gallery not available in current API response */}

          {/* Tour Provider */}
          {event.tour_provider && (
            <Card>
              <CardHeader>
                <CardTitle>Event Organizer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16 flex-shrink-0">
                    {!avatarError ? (
                      <AvatarImage
                        src={
                          event.tour_provider.thumbnail
                            ? getImageUrl(event.tour_provider.thumbnail)
                            : ""
                        }
                        className="object-cover"
                        onError={() => {
                          console.log(
                            "Avatar image failed to load, showing fallback"
                          );
                          setAvatarError(true);
                        }}
                      />
                    ) : null}
                    <AvatarFallback className="bg-gray-100">
                      {avatarError || !event.tour_provider.thumbnail ? (
                        <User className="h-8 w-8 text-gray-400" />
                      ) : (
                        event.tour_provider.name[0]
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">
                        {event.tour_provider.name}
                      </h3>
                      {event.tour_provider.is_verified ? (
                        <Badge variant="default">Verified</Badge>
                      ) : (
                        <Badge variant="secondary">Not Verified</Badge>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      {event.tour_provider.description}
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{event.tour_provider.address}</span>
                    </div>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1">
                        <Phone className="h-4 w-4" />
                        <span className="text-sm">
                          {event.tour_provider.phone}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="h-4 w-4" />
                        <span className="text-sm">
                          {event.tour_provider.mobile}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Quick Info & Similar */}
        <div className="space-y-6">
          {/* Capacity & Availability */}
          <Card>
            <CardHeader>
              <CardTitle>Event Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Seats:</span>
                <span className="font-semibold">
                  {event.total_seats ? event.total_seats : "-"}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status:</span>
                <Badge
                  variant={
                    availability.color === "default" ? "default" : "secondary"
                  }
                >
                  {availability.status}
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Tickets Available:</span>
                <span className="font-semibold">
                  {event.tickets?.length ? event.tickets.length : "-"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Location Details */}
          <Card>
            <CardHeader>
              <CardTitle>Location Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="text-sm font-medium text-right">
                  {event.location || "-"}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Provider ID:</span>
                <span className="font-mono text-sm">
                  {event.tour_provider_id || "-"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Event Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-gray-600">Price:</span>
                </div>
                <span className="font-semibold text-green-600">
                  {event.price ? `$${event.price}` : "-"}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-purple-500" />
                  <span className="text-gray-600">Duration:</span>
                </div>
                <span className="font-semibold">{calculateDuration()}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-gray-600">Active Status:</span>
                </div>
                <span className="font-semibold">
                  {event.is_active ? "Active" : "Inactive"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Meta Information */}
          <Card>
            <CardHeader>
              <CardTitle>Meta Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Created:</span>
                <span className="text-sm">
                  {event.created_at
                    ? new Date(event.created_at).toLocaleDateString()
                    : "-"}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Updated:</span>
                <span className="text-sm">
                  {event.updated_at
                    ? new Date(event.updated_at).toLocaleDateString()
                    : "-"}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Category ID:</span>
                <span className="text-sm">
                  {event.event_category_id || "-"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProviderEventDetailsPage;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  SearchX,
  Calendar,
  ImageIcon,
  RotateCcw,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import type { Event, EventCategory } from "../types/eventTypes";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getImageUrl } from "@/lib/imageUtils";
import AddProviderEventDialog from "./AddProviderEventDialog";
import EditProviderEventDialog from "./EditProviderEventDialog";
import DeleteProviderEventDialog from "./DeleteProviderEventDialog";

interface ProviderEventTableProps {
  events: Event[];
  selectedCategory: EventCategory | null;
}

const ProviderEventTable = ({
  events,
  selectedCategory,
}: ProviderEventTableProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

  // Track image errors for each event by ID
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const handleImageError = (eventId: number) => {
    console.log("Image failed to load for event:", eventId);
    setImageErrors((prev) => new Set(prev).add(eventId));
  };

  const retryImage = (eventId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setImageErrors((prev) => {
      const newSet = new Set(prev);
      newSet.delete(eventId);
      return newSet;
    });
  };

  // Reset image errors when events change
  useEffect(() => {
    setImageErrors(new Set());
  }, [events]);

  const getFilteredEvents = () => {
    let filtered = events;

    if (selectedCategory) {
      filtered = filtered.filter(
        (event) => event.event_category_id === selectedCategory.id
      );
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (event) =>
          event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (event.organizer &&
            event.organizer.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    return filtered;
  };

  const filteredEvents = getFilteredEvents();
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEvents = filteredEvents.slice(startIndex, endIndex);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleEventClick = (event: Event) => {
    navigate(`/provider/events/${event.id}`);
  };

  const getPageTitle = () => {
    if (searchTerm.trim()) {
      return selectedCategory
        ? `Search in ${selectedCategory.name}`
        : `Search Results`;
    }
    if (selectedCategory) {
      return selectedCategory.name;
    }
    return "My Events";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleEditClick = (event: Event) => {
    setEventToEdit(event);
    setEditDialogOpen(true);
  };

  const handleEditSuccess = () => {
    setEditDialogOpen(false);
    setEventToEdit(null);
  };

  const handleDeleteClick = (event: Event) => {
    setEventToDelete(event);
    setDeleteDialogOpen(true);
  };

  const handleDeleteSuccess = () => {
    setDeleteDialogOpen(false);
    setEventToDelete(null);
  };
  const EmptyState = () => {
    const isFiltered = searchTerm.trim() || selectedCategory;
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
          {isFiltered ? "No events found" : "No events yet"}
        </h3>
        <p className="text-gray-500 text-center max-w-sm mb-6">
          {isFiltered ? (
            searchTerm.trim() ? (
              selectedCategory ? (
                <>
                  No events in {selectedCategory.name} match "{searchTerm}
                  ". Try different keywords or browse other categories.
                </>
              ) : (
                <>
                  No events match your search "{searchTerm}". Try different
                  keywords or browse categories.
                </>
              )
            ) : (
              <>
                No events found in {selectedCategory?.name}. Try browsing other
                categories.
              </>
            )
          ) : (
            "Get started by adding your first event to showcase amazing experiences."
          )}
        </p>
        {!isFiltered && (
          <AddProviderEventDialog>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add First Event
            </Button>
          </AddProviderEventDialog>
        )}
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
            {selectedCategory && !searchTerm.trim() && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/provider/events")}
              >
                View All Events
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
          <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search events..."
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
        <AddProviderEventDialog>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </AddProviderEventDialog>
      </div>
      {currentEvents.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <ScrollArea className="xl:w-[1150px]">
            <Table>
              <TableHeader className="bg-gray-100 rounded-t-md">
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Organizer</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentEvents.map((event) => (
                  <TableRow
                    key={event.id}
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleEventClick(event)}
                  >
                    <TableCell>
                      {event.thumbnail && !imageErrors.has(event.id) ? (
                        <img
                          src={getImageUrl(event.thumbnail)}
                          alt={event.name}
                          className="w-12 h-12 object-cover rounded-md"
                          onError={() => handleImageError(event.id)}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center group relative">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                          {imageErrors.has(event.id) && (
                            <button
                              onClick={(e) => retryImage(event.id, e)}
                              className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center"
                              title="Retry loading image"
                            >
                              <RotateCcw className="w-4 h-4 text-white" />
                            </button>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{event.name}</TableCell>
                    <TableCell className="text-gray-600 max-w-xs truncate">
                      {event.description}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {event.location}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {event.organizer}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {formatDate(event.start_date)}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {formatDate(event.end_date)}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(event.updated_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(event);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(event);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar
              orientation="horizontal"
              className="opacity-0 hover:opacity-100 transition-opacity"
            />
          </ScrollArea>
          {filteredEvents.length > 0 && (
            <div className="flex items-center justify-between px-2 py-4">
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
                  {Math.min(endIndex, filteredEvents.length)} of{" "}
                  {filteredEvents.length} results
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

      {/* Edit Dialog */}
      {eventToEdit && (
        <EditProviderEventDialog
          event={eventToEdit}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSuccess={handleEditSuccess}
        />
      )}

      {/* Delete Dialog */}
      <DeleteProviderEventDialog
        event={eventToDelete}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={handleDeleteSuccess}
      />
    </Card>
  );
};

export default ProviderEventTable;

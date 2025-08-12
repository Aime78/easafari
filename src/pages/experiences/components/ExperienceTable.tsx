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
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MapPin,
  SearchX,
  Clock,
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

import type { Experience, ExperienceCategory } from "@/types/experiences.type";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { AddExperienceDialog } from "./AddExperienceDialog";

interface ExperienceTableProps {
  experiences: Experience[];
  selectedCategory: ExperienceCategory | null;
}

const ExperienceTable = ({
  experiences,
  selectedCategory,
}: ExperienceTableProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const getFilteredExperiences = () => {
    let filtered = experiences;

    if (selectedCategory) {
      filtered = filtered.filter(
        (exp) => exp.experience_category_id === selectedCategory.id
      );
    }

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (exp) =>
          exp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exp.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exp.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return filtered;
  };

  const filteredExperiences = getFilteredExperiences();
  const totalPages = Math.ceil(filteredExperiences.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExperiences = filteredExperiences.slice(startIndex, endIndex);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
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
    return "All Experiences";
  };

  const EmptyState = () => {
    const isFiltered = searchTerm.trim() || selectedCategory;
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          {isFiltered ? (
            <SearchX className="w-12 h-12 text-gray-400" />
          ) : (
            <MapPin className="w-12 h-12 text-gray-400" />
          )}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {isFiltered ? "No experiences found" : "No experiences yet"}
        </h3>
        <p className="text-gray-500 text-center max-w-sm mb-6">
          {isFiltered ? (
            searchTerm.trim() ? (
              selectedCategory ? (
                <>
                  No experiences in {selectedCategory.name} match "{searchTerm}
                  ". Try different keywords or browse other categories.
                </>
              ) : (
                <>
                  No experiences match your search "{searchTerm}". Try different
                  keywords or browse categories.
                </>
              )
            ) : (
              <>
                No experiences found in {selectedCategory?.name}. Try browsing
                other categories.
              </>
            )
          ) : (
            "Get started by adding your first experience to showcase amazing activities."
          )}
        </p>
        {!isFiltered && (
          <AddExperienceDialog>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add First Experience
            </Button>
          </AddExperienceDialog>
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
                // onClick={() => navigate('/experiences')}
              >
                View All Experiences
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
              placeholder="Search experiences..."
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
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <AddExperienceDialog>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          </AddExperienceDialog>
        </div>
      </div>
      {currentExperiences.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <ScrollArea className="xl:w-[1150px]">
            <Table>
              <TableHeader className="bg-gray-100 rounded-t-md ">
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Reviews</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentExperiences.map((exp) => (
                  <TableRow key={exp.id}>
                    <TableCell>
                      {exp.thumbnail ? (
                        <img
                          src={`http://161.35.164.109/${exp.thumbnail}`}
                          alt={exp.name}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                      ) : (
                        <img
                          src="/image_placeholder.png"
                          alt={exp.name}
                          className="w-12 h-12 object-cover rounded-md"
                        />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{exp.name}</TableCell>
                    <TableCell className="text-gray-600 max-w-xs truncate">
                      {exp.description}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {exp.address}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      ${exp.price}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {exp.duration}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {exp.rating ? (
                          <>
                            <span className="text-yellow-500 mr-1">★</span>
                            <span>
                              {exp.rating ? exp.rating.toFixed(1) : "N/A"}
                            </span>
                          </>
                        ) : (
                          <span className="text-gray-600 text-center">-</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {exp.reviews_count} reviews
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(exp.updated_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
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
          {filteredExperiences.length > 0 && (
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
                  {Math.min(endIndex, filteredExperiences.length)} of{" "}
                  {filteredExperiences.length} results
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

export default ExperienceTable;

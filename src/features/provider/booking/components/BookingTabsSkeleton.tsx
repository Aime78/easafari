import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Bed } from "lucide-react";
import ExperienceBookingTableSkeleton from "./ExperienceBookingTableSkeleton";
import AccommodationBookingTableSkeleton from "./AccommodationBookingTableSkeleton";

const BookingTabsSkeleton = () => {
  return (
    <div className="w-full">
      <Tabs defaultValue="experiences" className="w-full">
        <TabsList className="inline-flex">
          <TabsTrigger
            value="experiences"
            className="flex items-center gap-2"
            disabled
          >
            <Calendar className="h-4 w-4" />
            <span className="flex items-center gap-2">
              Experiences
              <div className="h-4 w-6 bg-gray-200 rounded animate-pulse"></div>
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="accommodations"
            className="flex items-center gap-2"
            disabled
          >
            <Bed className="h-4 w-4" />
            <span className="flex items-center gap-2">
              Accommodations
              <div className="h-4 w-6 bg-gray-200 rounded animate-pulse"></div>
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="experiences" className="mt-6">
          <ExperienceBookingTableSkeleton />
        </TabsContent>

        <TabsContent value="accommodations" className="mt-6">
          <AccommodationBookingTableSkeleton />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BookingTabsSkeleton;

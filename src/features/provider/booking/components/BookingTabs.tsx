import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Bed } from "lucide-react";
import ExperienceBookingTable from "./BookingTable";
import AccommodationBookingTable from "./AccommodationBookingTable";
import {
  useProviderExperienceBookings,
  useProviderAccommodationBookings,
} from "../hooks/useProviderBooking";
import type { Booking } from "../types/bookingTypes";
import type { AccommodationBooking } from "../types/accommodationBookingTypes";

const BookingTabs = () => {
  // Fetch experience bookings
  const {
    data: experienceBookingsData,
    isLoading: experienceLoading,
    error: experienceError,
  } = useProviderExperienceBookings();

  // Fetch accommodation bookings
  const {
    data: accommodationBookingsData,
    isLoading: accommodationLoading,
    error: accommodationError,
  } = useProviderAccommodationBookings();

  // Process experience bookings data
  let experienceBookings: Booking[] = [];
  if (experienceBookingsData) {
    if (Array.isArray(experienceBookingsData)) {
      experienceBookings = experienceBookingsData;
    } else {
      const dataObj = experienceBookingsData as unknown as {
        data?: Booking[];
        bookings?: Booking[];
      };
      if (dataObj.data && Array.isArray(dataObj.data)) {
        experienceBookings = dataObj.data;
      } else if (dataObj.bookings && Array.isArray(dataObj.bookings)) {
        experienceBookings = dataObj.bookings;
      }
    }
  }

  // Process accommodation bookings data
  let accommodationBookings: AccommodationBooking[] = [];
  if (accommodationBookingsData) {
    if (Array.isArray(accommodationBookingsData)) {
      accommodationBookings = accommodationBookingsData;
    } else {
      const dataObj = accommodationBookingsData as unknown as {
        data?: AccommodationBooking[];
        bookings?: AccommodationBooking[];
      };
      if (dataObj.data && Array.isArray(dataObj.data)) {
        accommodationBookings = dataObj.data;
      } else if (dataObj.bookings && Array.isArray(dataObj.bookings)) {
        accommodationBookings = dataObj.bookings;
      }
    }
  }

  // Loading state
  if (experienceLoading || accommodationLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (experienceError && accommodationError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading bookings</p>
          <p className="text-gray-600 text-sm">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Tabs defaultValue="experiences" className="w-full">
        <TabsList className="inline-flex">
          <TabsTrigger value="experiences" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Experiences ({experienceBookings.length})
          </TabsTrigger>
          <TabsTrigger
            value="accommodations"
            className="flex items-center gap-2"
          >
            <Bed className="h-4 w-4" />
            Accommodations ({accommodationBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="experiences" className="mt-6">
          <ExperienceBookingTable bookings={experienceBookings} />
        </TabsContent>

        <TabsContent value="accommodations" className="mt-6">
          <AccommodationBookingTable bookings={accommodationBookings} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BookingTabs;

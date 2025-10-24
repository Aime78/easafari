import { useParams } from "react-router-dom";
import ProviderEventTable from "../components/ProviderEventTable";
import EventTableSkeleton from "../components/EventTableSkeleton";
import {
  useProviderEvents,
  useProviderEventCategories,
} from "../hooks/useProviderEvent";
import { categoryToSlug } from "@/lib/utils";
import type { Event } from "../types/eventTypes";

const ProviderEventsPage = () => {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const { categories } = useProviderEventCategories();

  const selectedCategory = categorySlug
    ? categories.find((cat) => categoryToSlug(cat.name) === categorySlug) ||
      null
    : null;

  const {
    data: eventsData,
    isLoading,
    error,
  } = useProviderEvents(selectedCategory?.id);

  // Ensure we have a valid array of events
  let events: Event[] = [];

  if (eventsData) {
    if (Array.isArray(eventsData)) {
      events = eventsData;
    } else {
      // Handle wrapped response structure
      const dataObj = eventsData as unknown as {
        data?: Event[];
      };
      if (dataObj.data && Array.isArray(dataObj.data)) {
        events = dataObj.data;
      }
    }
  }

  if (isLoading) {
    return <EventTableSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading events</p>
          <p className="text-gray-600 text-sm">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ProviderEventTable events={events} selectedCategory={selectedCategory} />
    </div>
  );
};

export default ProviderEventsPage;

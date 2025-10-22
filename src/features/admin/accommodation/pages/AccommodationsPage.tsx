import { useParams } from "react-router-dom";
import AccommodationTable from "../components/AccommodationTable";
import AccommodationTableSkeleton from "../../../provider/accommodation/components/AccommodationTableSkeleton";
import {
  useAccommodations,
  useAccommodationCategories,
} from "../hooks/useAccommodation";
import { categoryToSlug } from "@/lib/utils";
import type { Accommodation } from "../types/accommodationTypes";

const AccommodationsPage = () => {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const { categories } = useAccommodationCategories();

  const selectedCategory = categorySlug
    ? categories.find((cat) => categoryToSlug(cat.name) === categorySlug) ||
      null
    : null;

  const {
    data: accommodationsData,
    isLoading,
    error,
  } = useAccommodations(selectedCategory?.id);

  if (isLoading) {
    return <AccommodationTableSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading accommodations</p>
          <p className="text-gray-600 text-sm">
            Error: {(error as Error)?.message || "Unknown error"}
          </p>
        </div>
      </div>
    );
  }

  // Safely extract accommodations array
  let accommodations: Accommodation[] = [];

  try {
    if (Array.isArray(accommodationsData)) {
      accommodations = accommodationsData;
    } else if (accommodationsData && typeof accommodationsData === "object") {
      // Handle case where API returns { data: [...] } or similar structure
      const dataObj = accommodationsData as Record<string, unknown>;
      if (Array.isArray(dataObj.data)) {
        accommodations = dataObj.data as Accommodation[];
      } else if (Array.isArray(dataObj.accommodations)) {
        accommodations = dataObj.accommodations as Accommodation[];
      }
    }
  } catch (err) {
    console.error("Error processing accommodations data:", err);
  }

  return (
    <div>
      <AccommodationTable
        accommodations={accommodations}
        selectedCategory={selectedCategory}
      />
    </div>
  );
};

export default AccommodationsPage;

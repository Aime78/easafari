import { useParams } from "react-router-dom";
import ProviderAccommodationTable from "../components/ProviderAccommodationTable";
import AccommodationTableSkeleton from "../components/AccommodationTableSkeleton";
import {
  useProviderAccommodations,
  useProviderAccommodationCategories,
} from "../hooks/useProviderAccommodation";
import { categoryToSlug } from "@/lib/utils";
import type { Accommodation } from "../types/accommodationTypes";

const ProviderAccommodationsPage = () => {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const { categories } = useProviderAccommodationCategories();

  const selectedCategory = categorySlug
    ? categories.find((cat) => categoryToSlug(cat.name) === categorySlug) ||
      null
    : null;

  const {
    data: accommodationsData,
    isLoading,
    error,
  } = useProviderAccommodations(selectedCategory?.id);

  // Ensure we have a valid array of accommodations
  let accommodations: Accommodation[] = [];

  if (accommodationsData) {
    if (Array.isArray(accommodationsData)) {
      accommodations = accommodationsData;
    } else {
      // Handle wrapped response structure
      const dataObj = accommodationsData as unknown as {
        data?: Accommodation[];
      };
      if (dataObj.data && Array.isArray(dataObj.data)) {
        accommodations = dataObj.data;
      }
    }
  }

  if (isLoading) {
    return <AccommodationTableSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading accommodations</p>
          <p className="text-gray-600 text-sm">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ProviderAccommodationTable
        accommodations={accommodations}
        selectedCategory={selectedCategory}
      />
    </div>
  );
};

export default ProviderAccommodationsPage;

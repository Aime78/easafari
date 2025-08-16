import { useParams } from "react-router-dom";
import AccommodationTable from "../components/AccommodationTable";
import {
  useAccommodations,
  useAccommodationCategories,
} from "../hooks/useAccommodation";
import { categoryToSlug } from "@/lib/utils";

const AccommodationsPage = () => {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const { categories } = useAccommodationCategories();

  const selectedCategory = categorySlug
    ? categories.find((cat) => categoryToSlug(cat.name) === categorySlug) ||
      null
    : null;

  const {
    data: accommodationsData = [],
    isLoading,
    error,
  } = useAccommodations(selectedCategory?.id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading accommodations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading accommodations</p>
          <p className="text-gray-600 text-sm">Using sample data for now.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AccommodationTable
        accommodations={accommodationsData}
        selectedCategory={selectedCategory}
      />
    </div>
  );
};

export default AccommodationsPage;

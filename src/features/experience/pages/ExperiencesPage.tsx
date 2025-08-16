import { useParams } from "react-router-dom";
import ExperienceTable from "../components/ExperienceTable";
import {
  useExperiences,
  useExperienceCategories,
} from "../hooks/useExperience";
import { categoryToSlug } from "@/lib/utils";

const ExperiencesPage = () => {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const { categories } = useExperienceCategories();

  const selectedCategory = categorySlug
    ? categories.find((cat) => categoryToSlug(cat.name) === categorySlug) ||
      null
    : null;

  const {
    data: experiencesData = [],
    isLoading,
    error,
  } = useExperiences(selectedCategory?.id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading experiences...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading experiences</p>
          <p className="text-gray-600 text-sm">Using sample data for now.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ExperienceTable
        experiences={experiencesData}
        selectedCategory={selectedCategory}
      />
    </div>
  );
};

export default ExperiencesPage;

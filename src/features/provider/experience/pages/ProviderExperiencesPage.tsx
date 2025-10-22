import { useParams } from "react-router-dom";
import ProviderExperienceTable from "../components/ProviderExperienceTable";
import ExperienceTableSkeleton from "../components/ExperienceTableSkeleton";
import {
  useProviderExperiences,
  useProviderExperienceCategories,
} from "../hooks/useProviderExperience";
import { categoryToSlug } from "@/lib/utils";
import type { Experience } from "../types/experienceTypes";

const ProviderExperiencesPage = () => {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const { categories } = useProviderExperienceCategories();

  const selectedCategory = categorySlug
    ? categories.find((cat) => categoryToSlug(cat.name) === categorySlug) ||
      null
    : null;

  const {
    data: experiencesData,
    isLoading,
    error,
  } = useProviderExperiences(selectedCategory?.id);

  // Ensure we have a valid array of experiences
  let experiences: Experience[] = [];

  if (experiencesData) {
    if (Array.isArray(experiencesData)) {
      experiences = experiencesData;
    } else {
      // Handle wrapped response structure
      const dataObj = experiencesData as unknown as { data?: Experience[] };
      if (dataObj.data && Array.isArray(dataObj.data)) {
        experiences = dataObj.data;
      }
    }
  }

  if (isLoading) {
    return <ExperienceTableSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading experiences</p>
          <p className="text-gray-600 text-sm">Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ProviderExperienceTable
        experiences={experiences}
        selectedCategory={selectedCategory}
      />
    </div>
  );
};

export default ProviderExperiencesPage;

import AttractionTable from "../components/AttractionTable";
import { useAttractionCategories } from "../hooks/useAttraction";
import { InlineLoader } from "@/components/custom/InlineLoader";

const AttractionsPage = () => {
  const { categories, loading: categoriesLoading } = useAttractionCategories();

  if (categoriesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <InlineLoader size="lg" text="Loading attractions..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AttractionTable categories={categories} />
    </div>
  );
};

export default AttractionsPage;

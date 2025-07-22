
import { useLocation } from "react-router-dom";
import AttractionTable from "./components/AttractionTable";
import type { Attraction } from "@/types/attractions.type";

const AttractionsPage = () => {
  const location = useLocation();

  // Sample data for attractions
  const allAttractions: Attraction[] = [
    {
      id: 1,
      name: "Volcanoes National Park",
      category: "national-parks",
      location: "Musanze District",
      status: "Active",
      visitors: 15420,
      lastUpdated: "2024-12-15"
    },
    {
      id: 2,
      name: "Akagera National Park", 
      category: "national-parks",
      location: "Eastern Province",
      status: "Active",
      visitors: 12350,
      lastUpdated: "2024-12-14"
    },
    {
      id: 3,
      name: "Nyungwe National Park",
      category: "national-parks", 
      location: "Southern Province",
      status: "Active",
      visitors: 8790,
      lastUpdated: "2024-12-13"
    },
    {
      id: 4,
      name: "Kigali Genocide Memorial",
      category: "cultural-heritage",
      location: "Kigali City",
      status: "Active", 
      visitors: 25600,
      lastUpdated: "2024-12-16"
    },
    {
      id: 5,
      name: "King's Palace Museum",
      category: "cultural-heritage",
      location: "Nyanza District",
      status: "Active",
      visitors: 5430,
      lastUpdated: "2024-12-12"
    },
    {
      id: 6,
      name: "Ethnographic Museum",
      category: "cultural-heritage",
      location: "Huye District", 
      status: "Maintenance",
      visitors: 3200,
      lastUpdated: "2024-12-10"
    }
  ];
  
  // Determine the current filter based on the route
  const getCurrentFilter = () => {
    if (location.pathname.includes('/national-parks')) {
      return 'national-parks';
    } else if (location.pathname.includes('/cultural-heritage')) {
      return 'cultural-heritage';
    }
    return 'all';
  };

  const currentFilter = getCurrentFilter();

  return (
    <div>
      <AttractionTable 
        attractions={allAttractions} 
        currentFilter={currentFilter} 
      />
    </div>
  );
};

export default AttractionsPage
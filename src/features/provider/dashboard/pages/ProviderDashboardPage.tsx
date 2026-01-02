import {
  Home,
  Mountain,
  Calendar,
  Package,
  DollarSign,
  Clock,
} from "lucide-react";
import { StatCard } from "../components/StatCard";
import { useDashboardStats } from "../hooks/useDashboard";
import { PageLoader } from "@/components/custom/PageLoader";

const ProviderDashboardPage = () => {
  const { data: dashboardData, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">
            Error loading dashboard
          </h2>
          <p className="text-gray-600 mt-2">Please try again later</p>
        </div>
      </div>
    );
  }

  // Stats data using fetched data
  const stats = [
    {
      icon: Home,
      label: "Total Accommodations",
      value: String(dashboardData?.total_accommodations ?? 0),
      change: "",
    },
    {
      icon: Mountain,
      label: "Total Experiences",
      value: String(dashboardData?.total_experiences ?? 0),
      change: "",
    },
    {
      icon: Package,
      label: "Total Products",
      value: String(dashboardData?.total_products ?? 0),
      change: "",
    },
    {
      icon: Calendar,
      label: "Accommodation Bookings",
      value: String(dashboardData?.total_accommodation_bookings ?? 0),
      change: "",
    },
    {
      icon: DollarSign,
      label: "Experience Bookings",
      value: String(dashboardData?.total_experiences_bookings ?? 0),
      change: "",
    },
    {
      icon: Clock,
      label: "Total Orders",
      value: String(dashboardData?.total_orders ?? 0),
      change: "",
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here's what's happening with your business.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
    </div>
  );
};

export default ProviderDashboardPage;

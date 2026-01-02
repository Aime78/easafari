import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";

const AccommodationDetailsSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            disabled
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Accommodations</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Accommodation Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-48 h-48 bg-gray-200 rounded-lg animate-pulse" />
                <div className="flex-1 space-y-3">
                  <div>
                    <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-1/2 mt-2 animate-pulse" />
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
                  </div>

                  <div className="flex items-center space-x-1">
                    <div className="h-8 bg-gray-200 rounded w-24 animate-pulse" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              </div>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-8 bg-gray-200 rounded-full w-24 animate-pulse"
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Rooms */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="h-6 bg-gray-200 rounded w-40 animate-pulse" />
              <Button size="sm" disabled>
                <Plus className="h-4 w-4 mr-2" />
                Add Room
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 space-y-2">
                        <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
                        <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right mr-4">
                          <div className="h-6 bg-gray-200 rounded w-16 animate-pulse mb-1" />
                          <div className="h-3 bg-gray-200 rounded w-16 animate-pulse" />
                        </div>
                        <div className="flex gap-2">
                          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                          <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="h-6 bg-gray-200 rounded w-24 animate-pulse" />
                      <div className="h-6 bg-gray-200 rounded w-24 animate-pulse" />
                      <div className="h-6 bg-gray-200 rounded w-20 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tour Provider */}
          <Card>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-4">
                <div className="h-16 w-16 bg-gray-200 rounded-full animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                  <div className="flex items-center gap-4 mt-2">
                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Quick Info & Similar */}
        <div className="space-y-6">
          {/* Location Details */}
          <Card>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-32 animate-pulse" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                  </div>
                  {i < 2 && <div className="h-px bg-gray-200 my-3" />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-24 animate-pulse" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
                  </div>
                  {i < 3 && <div className="h-px bg-gray-200 my-3" />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Similar Accommodations */}
          <Card>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-48 animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center space-x-3 p-3 border rounded-lg"
                  >
                    <div className="w-12 h-12 bg-gray-200 rounded animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                      <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Meta Information */}
          <Card>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-40 animate-pulse" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
                  </div>
                  {i < 2 && <div className="h-px bg-gray-200 my-3" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AccommodationDetailsSkeleton;

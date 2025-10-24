import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Star,
  Users,
  DollarSign,
  Edit,
  Phone,
  Bed,
  Wifi,
  Car,
  Coffee,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProviderAccommodation } from "../hooks/useProviderAccommodation";
import { getImageUrl, getFallbackImageUrl } from "@/lib/imageUtils";
import type {
  AccommodationDetailsResponse,
  Room,
} from "../types/accommodationTypes";
import AddProviderAccommodationRoomDialog from "../components/AddProviderAccommodationRoomDialog";
import EditProviderRoomDialog from "../components/EditProviderRoomDialog";
import DeleteProviderRoomDialog from "../components/DeleteProviderRoomDialog";

const ProviderAccommodationDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: accommodationData,
    isLoading,
    error,
  } = useProviderAccommodation(id!) as {
    data: AccommodationDetailsResponse | undefined;
    isLoading: boolean;
    error: Error | null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading accommodation details...</p>
        </div>
      </div>
    );
  }

  if (error || !accommodationData?.accommodation) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            Error loading accommodation details
          </p>
          <p className="text-gray-600 text-sm">Please try again later.</p>
          <Button
            variant="outline"
            onClick={() => navigate("/provider/accommodations")}
            className="mt-4"
          >
            Back to Accommodations
          </Button>
        </div>
      </div>
    );
  }

  const { accommodation, similar = [] } = accommodationData;

  const handleBackClick = () => {
    navigate("/provider/accommodations");
  };

  const getAmenityIcon = (amenity: string) => {
    const lowerAmenity = amenity.toLowerCase().trim();
    if (lowerAmenity.includes("wifi") || lowerAmenity.includes("internet"))
      return <Wifi className="h-4 w-4" />;
    if (lowerAmenity.includes("parking")) return <Car className="h-4 w-4" />;
    if (lowerAmenity.includes("pool")) return <Users className="h-4 w-4" />;
    if (lowerAmenity.includes("coffee") || lowerAmenity.includes("breakfast"))
      return <Coffee className="h-4 w-4" />;
    return <Bed className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackClick}
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
                <img
                  src={
                    accommodation.thumbnail
                      ? getImageUrl(accommodation.thumbnail)
                      : getFallbackImageUrl()
                  }
                  alt={accommodation.name}
                  onError={(e) => {
                    e.currentTarget.src = getFallbackImageUrl();
                  }}
                  className="w-full sm:w-48 h-48 object-cover rounded-lg"
                />
                <div className="flex-1 space-y-3">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {accommodation.name}
                    </h1>
                    <div className="flex items-center space-x-2 mt-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">
                        {accommodation.address}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="font-semibold">
                        {accommodation.rating || "N/A"}
                      </span>
                      <span className="text-gray-500">
                        ({accommodation.reviews_count || 0} reviews)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <span className="text-2xl font-bold text-green-600">
                      ${accommodation.price}
                    </span>
                    <span className="text-gray-500">per night</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {accommodation.description || "No description available."}
              </p>
            </CardContent>
          </Card>

          {/* Amenities */}
          <Card>
            <CardHeader>
              <CardTitle>Amenities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {accommodation.amenities && accommodation.amenities.trim() ? (
                  accommodation.amenities.split(",").map((amenity, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-sm flex items-center gap-1"
                    >
                      {getAmenityIcon(amenity)}
                      {amenity.trim()}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-500 italic">No amenities listed</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Rooms */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                Available Rooms ({accommodation.rooms?.length || 0})
              </CardTitle>
              <AddProviderAccommodationRoomDialog
                accommodationId={accommodation.id.toString()}
              >
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Room
                </Button>
              </AddProviderAccommodationRoomDialog>
            </CardHeader>
            <CardContent>
              {accommodation.rooms && accommodation.rooms.length > 0 ? (
                <div className="grid gap-4">
                  {accommodation.rooms.map((room: Room) => (
                    <div key={room.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{room.name}</h3>
                          <p className="text-gray-600 text-sm">
                            {room.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-right mr-4">
                            <div className="text-xl font-bold text-green-600">
                              ${room.price_per_night}
                            </div>
                            <div className="text-sm text-gray-500">
                              per night
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <EditProviderRoomDialog room={room}>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </EditProviderRoomDialog>
                            <DeleteProviderRoomDialog room={room}>
                              <Button size="sm" variant="outline">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DeleteProviderRoomDialog>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            {room.capacity} guests
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bed className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            {room.quantity} available
                          </span>
                        </div>
                        <Badge
                          variant={room.is_available ? "default" : "secondary"}
                        >
                          {room.is_available ? "Available" : "Not Available"}
                        </Badge>
                      </div>

                      {room.images && room.images.length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                          {room.images.map((image, index) => (
                            <img
                              key={index}
                              src={
                                image
                                  ? getImageUrl(image)
                                  : getFallbackImageUrl()
                              }
                              alt={`${room.name} - Image ${index + 1}`}
                              onError={(e) => {
                                e.currentTarget.src = getFallbackImageUrl();
                              }}
                              className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No rooms available</p>
              )}
            </CardContent>
          </Card>

          {/* Tour Provider */}
          {accommodation.tour_provider && (
            <Card>
              <CardHeader>
                <CardTitle>Tour Provider</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16 flex-shrink-0">
                    <AvatarImage
                      src={getImageUrl(accommodation.tour_provider.thumbnail)}
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {accommodation.tour_provider.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">
                        {accommodation.tour_provider.name}
                      </h3>
                      {accommodation.tour_provider.is_verified ? (
                        <Badge variant="default">Verified</Badge>
                      ) : (
                        <Badge variant="secondary">Not Verified</Badge>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      {accommodation.tour_provider.description}
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span>{accommodation.tour_provider.address}</span>
                    </div>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1">
                        <Phone className="h-4 w-4" />
                        <span className="text-sm">
                          {accommodation.tour_provider.phone}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="h-4 w-4" />
                        <span className="text-sm">
                          {accommodation.tour_provider.mobile}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Quick Info & Similar */}
        <div className="space-y-6">
          {/* Location Details */}
          <Card>
            <CardHeader>
              <CardTitle>Location Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Address:</span>
                <span className="text-sm font-medium text-right">
                  {accommodation.address}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Latitude:</span>
                <span className="font-mono text-sm">
                  {accommodation.latitude || "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Longitude:</span>
                <span className="font-mono text-sm">
                  {accommodation.longitude || "N/A"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="text-gray-600">Rating:</span>
                </div>
                <span className="font-semibold">
                  {accommodation.rating || "N/A"}/5
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-gray-600">Reviews:</span>
                </div>
                <span className="font-semibold">
                  {accommodation.reviews_count || 0}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-gray-600">Price/Night:</span>
                </div>
                <span className="font-semibold text-green-600">
                  ${accommodation.price}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bed className="h-4 w-4 text-purple-500" />
                  <span className="text-gray-600">Total Rooms:</span>
                </div>
                <span className="font-semibold">
                  {accommodation.rooms?.length || 0}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Similar Accommodations */}
          {similar.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Similar Accommodations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {similar.slice(0, 3).map((acc) => (
                    <div
                      key={acc.id}
                      className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <img
                        src={
                          acc.thumbnail
                            ? getImageUrl(acc.thumbnail)
                            : getFallbackImageUrl()
                        }
                        alt={acc.name}
                        className="w-12 h-12 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = getFallbackImageUrl();
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{acc.name}</h4>
                        <div className="flex items-center space-x-2">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600">
                            {acc.rating}
                          </span>
                          <span className="text-xs font-semibold text-green-600">
                            ${acc.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Meta Information */}
          <Card>
            <CardHeader>
              <CardTitle>Meta Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Created:</span>
                <span className="text-sm">
                  {new Date(accommodation.created_at).toLocaleDateString()}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Updated:</span>
                <span className="text-sm">
                  {new Date(accommodation.updated_at).toLocaleDateString()}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Category ID:</span>
                <span className="text-sm">
                  {accommodation.accommodation_category_id}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProviderAccommodationDetailsPage;

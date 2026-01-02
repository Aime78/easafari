import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AttractionTableSkeleton = () => {
  // Create skeleton rows
  const skeletonRows = Array.from({ length: 10 }, (_, i) => i);

  return (
    <>
      <Table>
        <TableHeader className="bg-gray-100 rounded-t-md">
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Reviews</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {skeletonRows.map((index) => (
            <TableRow key={index}>
              {/* Image Skeleton */}
              <TableCell>
                <div className="w-12 h-12 bg-gray-200 rounded-md animate-pulse"></div>
              </TableCell>

              {/* Name Skeleton */}
              <TableCell>
                <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
              </TableCell>

              {/* Description Skeleton */}
              <TableCell>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                </div>
              </TableCell>

              {/* Address Skeleton */}
              <TableCell>
                <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
              </TableCell>

              {/* Rating Skeleton */}
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
                </div>
              </TableCell>

              {/* Reviews Skeleton */}
              <TableCell>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              </TableCell>

              {/* Last Updated Skeleton */}
              <TableCell>
                <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
              </TableCell>

              {/* Actions Skeleton */}
              <TableCell className="text-right">
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse ml-auto"></div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between px-2 py-4">
        <div className="flex items-center space-x-2">
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
          <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>

        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
          <div className="flex items-center space-x-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-8 w-8 bg-gray-200 rounded animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AttractionTableSkeleton;

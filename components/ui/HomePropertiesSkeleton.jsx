import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const HomePropertiesSkeleton = () => {
  return (
    <section className="px-4 py-6">
      <div className="container-xl lg:container m-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="relative p-4 rounded-lg shadow-lg bg-white transition overflow-hidden w-full"
            >
              {/* Property Image Skeleton */}
              <Skeleton height={220} className="w-full rounded-t-md" />

              {/* Price Tag Skeleton */}
              <div className="absolute top-4 left-4">
                <Skeleton width={100} height={28} className="rounded-full" />
              </div>

              {/* Action Buttons Skeleton */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <Skeleton circle height={35} width={35} />
                <Skeleton circle height={35} width={35} />
              </div>

              {/* Bottom Tags Skeleton */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between gap-2">
                <Skeleton width={80} height={24} className="rounded-full" />
                <Skeleton width={80} height={24} className="rounded-full" />
                <Skeleton width={80} height={24} className="rounded-full" />
              </div>

              <div className="p-4">
                {/* Property Title Skeleton */}
                <Skeleton height={22} width={200} className="mt-2" />

                {/* Property Details Skeleton */}
                <Skeleton height={16} width={160} className="mt-2" />
                <Skeleton height={16} width={180} className="mt-2" />
                <Skeleton height={16} width={120} className="mt-2" />

                {/* Location Skeleton */}
                <Skeleton height={16} width={140} className="mt-3" />
              </div>
            </div>
          ))}
        </div>

        {/* See More Button Skeleton */}
        <div className="m-auto max-w-xs my-10 px-6">
          <Skeleton height={50} width={200} className="rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default HomePropertiesSkeleton;

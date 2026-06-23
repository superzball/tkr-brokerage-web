import { Skeleton, SkeletonCards, SkeletonTable } from "@/components/app/Skeleton";

/** Shared loading state for every app screen (lists, dashboard, detail). */
export default function AppLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-72 mt-2" />
      </div>
      <SkeletonCards count={4} />
      <SkeletonTable rows={6} />
    </div>
  );
}

import { Skeleton } from "@/components/app/Skeleton";

/** Marketing-zone loading fallback (shimmer). Static pages skip this; it shows
 *  while navigating to uncached content like /articles/[slug]. */
export default function MarketingLoading() {
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <Skeleton className="h-7 w-40 mb-6" />
      <Skeleton className="h-10 w-3/4 mb-3" />
      <Skeleton className="h-5 w-1/2 mb-8" />
      <Skeleton className="h-56 w-full rounded-3xl mb-8" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </main>
  );
}

import { Skeleton } from "./Skeleton";

export const LoadingState = () => (
    <div className="w-full space-y-4 p-6">
      <Skeleton className="h-32 w-full" />
      <div className="grid grid-cols-2 gap-4">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  );
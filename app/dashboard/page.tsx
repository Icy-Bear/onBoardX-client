"use client";

import { useSession } from "@/lib/auth-client";
import { Spinner } from "@/components/ui/spinner";

export default function DashboardPage() {
  const { data, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex h-screen justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-3 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground text-sm sm:text-base mt-1">
              Welcome back, {data?.user?.name}!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

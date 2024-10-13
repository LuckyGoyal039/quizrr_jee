"use client";

import { OnboardCard } from "@/components/OnboardCard";
import { Suspense } from "react";

function Page() {
  return (
    <div className="flex justify-center items-center h-full">
      <Suspense fallback={<>Loading...</>}>
        <OnboardCard />
      </Suspense>
    </div>
  );
}
export default Page;
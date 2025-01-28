import React, { Suspense } from "react";
import HomePage from "./(pages)/(properties)/page";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePage />
    </Suspense>
  );
}
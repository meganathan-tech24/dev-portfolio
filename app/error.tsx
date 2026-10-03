"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main" className="section">
      <div className="container-page">
        <h1 className="type-h2">Something went wrong</h1>
        <p className="type-body mt-4">
          The page failed to load. Trying again often fixes it.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={() => retry()}>Try again</Button>
          <Button href="/" variant="secondary">
            Go to the home page
          </Button>
        </div>
      </div>
    </main>
  );
}

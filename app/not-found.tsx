import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main id="main" className="section">
      <div className="container-page">
        <h1 className="type-h2">Page not found</h1>
        <p className="type-body mt-4">
          There is no page at this address. It may have moved, or the link may be wrong.
        </p>
        <div className="mt-8">
          <Button href="/">Go to the home page</Button>
        </div>
      </div>
    </main>
  );
}

"use client";

import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function BackToTopButton() {
  return (
    <Button
      variant="secondary"
      className="btn-sm"
      onClick={() => {
        // no section in the address bar once we are back at the top
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
        // "auto" follows the page's own scroll-behavior, which is smooth only when motion is allowed
        window.scrollTo({ top: 0, behavior: "auto" });
      }}
    >
      <ArrowUp aria-hidden="true" className="size-4" />
      Back to top
    </Button>
  );
}

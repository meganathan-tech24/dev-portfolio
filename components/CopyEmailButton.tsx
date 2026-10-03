"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";

type Status = "idle" | "copied" | "failed";

const LABELS: Record<Status, string> = {
  idle: "Copy email",
  copied: "Copied",
  failed: "Copy failed",
};

const ANNOUNCEMENTS: Record<Status, string> = {
  idle: "",
  copied: "Email address copied to the clipboard",
  failed: "Could not copy. Select the address and copy it manually.",
};

export function CopyEmailButton({ email }: { email: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 2000);
  }

  const Icon = status === "copied" ? Check : Copy;

  return (
    <>
      <Button variant="secondary" onClick={copy}>
        <Icon aria-hidden="true" className="size-4" />
        {LABELS[status]}
      </Button>
      <span role="status" aria-live="polite" className="sr-only">
        {ANNOUNCEMENTS[status]}
      </span>
    </>
  );
}

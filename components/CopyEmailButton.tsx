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

const STATUSES = Object.keys(LABELS) as Status[];

export function CopyEmailButton({ email, className }: { email: string; className?: string }) {
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

  return (
    <>
      <Button variant="secondary" className={className} onClick={copy}>
        {/* The copy icon turns into a check and back */}
        <span className="icon-swap size-5" data-icon={status === "copied" ? "b" : "a"}>
          <Copy aria-hidden="true" />
          <Check aria-hidden="true" />
        </span>
        {/* All labels share one grid cell, so the button keeps one width while the text swaps */}
        <span className="grid">
          {STATUSES.map((name) => (
            <span
              key={name}
              className="label-swap"
              data-active={status === name}
              aria-hidden={status !== name}
            >
              {LABELS[name]}
            </span>
          ))}
        </span>
      </Button>
      <span role="status" aria-live="polite" className="sr-only">
        {ANNOUNCEMENTS[status]}
      </span>
    </>
  );
}

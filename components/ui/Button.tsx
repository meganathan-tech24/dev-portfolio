import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = {
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
} & (
  | ({ href: string } & Omit<ComponentPropsWithoutRef<"a">, "href" | "className">)
  | ({ href?: undefined } & Omit<ComponentPropsWithoutRef<"button">, "className">)
);

function isExternal(href: string) {
  return /^https?:\/\//.test(href);
}

export function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  const classes = cn("btn", variant === "primary" ? "btn-primary" : "btn-secondary", className);

  if (props.href === undefined) {
    const { type = "button", ...rest } = props;
    return (
      <button type={type} className={classes} {...rest}>
        {children}
      </button>
    );
  }

  const { href, ...rest } = props;

  if (isExternal(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes} {...rest}>
        {children}
      </a>
    );
  }

  // Internal routes use next/link; hash links, mailto: and downloads stay plain anchors
  if (href.startsWith("/") && !rest.download) {
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={classes} {...rest}>
      {children}
    </a>
  );
}

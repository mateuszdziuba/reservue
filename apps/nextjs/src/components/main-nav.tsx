"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "~/lib/utils";

export function MainNav({
  className,
  navItems,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  navItems: { href: Route; title: string }[];
}) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "hidden items-center space-x-4 md:flex lg:space-x-6",
        className,
      )}
      {...props}
    >
      {navItems.map((item, idx) => (
        <Link
          href={item.href}
          key={`${item.href}-${idx}`}
          className={cn(
            "hover:text-primary text-sm font-medium transition-colors",
            pathname !== item.href && "text-muted-foreground",
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}

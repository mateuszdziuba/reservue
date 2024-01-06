"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "~/lib/utils";
import { authNavItems } from "../../config";

export function SidebarNav() {
  const pathname = usePathname();
  return (
    <nav className="grid items-start gap-2">
      {authNavItems.map((item, index) => {
        const Icon = item.icon;

        return (
          item.href && (
            <Link
              key={index}
              href={item.href}
              aria-disabled={"disabled" in item}
            >
              <span
                className={cn(
                  "hover:bg-accent hover:text-accent-foreground group flex items-center rounded-md px-3 py-2 text-sm font-medium",
                  pathname === item.href ? "bg-accent" : "transparent",
                  "disabled" in item && "cursor-not-allowed opacity-80",
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </span>
            </Link>
          )
        );
      })}
    </nav>
  );
}

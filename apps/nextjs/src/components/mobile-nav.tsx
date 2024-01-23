"use client";

import * as React from "react";
import Link from "next/link";
import { Book } from "lucide-react";

import { authNavItems, guestNavItems } from "~/app/config";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ScrollArea } from "~/components/ui/scroll-area";

export function MobileDropdown({
  isAuthenticated,
}: {
  isAuthenticated?: boolean;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [isOpen]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Book className="mr-2 h-6 w-6" />
          <span className="text-lg font-bold tracking-tight">reservue</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-40 mt-2 h-[calc(100vh-4rem)] w-screen animate-none rounded-none border-none transition-transform">
        <ScrollArea className="py-8">
          {[...guestNavItems, ...(isAuthenticated ? authNavItems : [])].map(
            (item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:text-primary flex py-1 text-base font-medium transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.title}
              </Link>
            ),
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

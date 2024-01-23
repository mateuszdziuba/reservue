import Link from "next/link";
import { Book } from "lucide-react";

import { cn } from "~/lib/utils";

export function SiteFooter(props: { className?: string }) {
  return (
    <footer className={cn("border-t", props.className)}>
      <div className="container my-4 grid grid-cols-2 md:flex md:items-center">
        <Link
          href="/"
          className="col-start-1 row-start-1 flex items-center gap-2 md:mr-2"
        >
          <Book className="h-6 w-6" />
          <p className="text-lg font-medium md:hidden">reservue</p>
        </Link>
        <p className="text-muted-foreground col-span-full row-start-2 text-center text-sm leading-loose md:flex-1 md:text-left">
          Stworzona przez{" "}
          <a
            href="https://github.com/mateuszdziuba"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Mateusz Dziuba
          </a>
          . Dla{" "}
          <a
            href="https://pjwstk.edu.pl"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            PJATK
          </a>
        </p>
      </div>
    </footer>
  );
}

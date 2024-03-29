import Link from "next/link";
import { Book } from "lucide-react";

import { SiteFooter } from "~/components/footer";

export default function AuthLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <div className="relative grid min-h-screen grid-cols-1 overflow-hidden md:grid-cols-3 lg:grid-cols-2">
        <div className="relative">
          <div
            className="absolute inset-0 bg-cover"
            style={{
              backgroundImage:
                "url(https://images.unsplash.com/photo-1529148069459-d5cf314016f2?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)",
            }}
          />
          <div className="from-background to-background/60 md:to-background/40 absolute inset-0 bg-gradient-to-t" />
          <Link
            href="/"
            className="absolute left-8 top-8 z-20 flex items-center text-lg font-bold"
          >
            <Book className="mr-2 h-6 w-6" />
            <span>reservue</span>
          </Link>
        </div>

        <div className="container absolute top-1/2 col-span-1 flex -translate-y-1/2 items-center md:static md:top-0 md:col-span-2 md:flex md:translate-y-0 lg:col-span-1">
          {props.children}
        </div>
      </div>
      <SiteFooter className="border-none" />
    </>
  );
}

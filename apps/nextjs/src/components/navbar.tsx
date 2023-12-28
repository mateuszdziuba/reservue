import Link from "next/link";
import { Book } from "lucide-react";

import { auth, signOut } from "@reservue/auth";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export async function Navbar() {
  const session = await auth();

  return (
    <header className="flex items-center justify-between bg-white px-6 py-4">
      <div className="flex items-center text-black">
        <Book className="mr-2 h-8 w-8" />
        <span className="text-2xl font-bold ">reservue</span>
      </div>
      <nav className="space-x-4">
        <Link className="text-sm font-medium hover:underline" href="#">
          Home
        </Link>
        <Link className="text-sm font-medium hover:underline" href="#">
          Services
        </Link>
        <Link className="text-sm font-medium hover:underline" href="#">
          About
        </Link>
        <Link className="text-sm font-medium hover:underline" href="#">
          Contact
        </Link>
      </nav>
      {session ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              <AvatarImage src={session.user.image!} alt={session.user.name!} />
              <AvatarFallback>
                {session.user.name
                  ?.split(" ")
                  .map((word) => word[0])
                  .slice(0, 2)
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard">Dashboard</Link>
            </DropdownMenuItem>
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <Button>Sign out</Button>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button asChild>
          <Link href="/login">Sign In</Link>
        </Button>
      )}
    </header>
  );
}

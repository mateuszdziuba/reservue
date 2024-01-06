import type { LucideIcon } from "lucide-react";
import type { Route } from "next";
import {
  BarChart,
  BookUser,
  ClipboardEdit,
  FileQuestion,
  HeartHandshake,
  Users,
} from "lucide-react";

export const guestNavItems = [
  {
    href: "/",
    title: "Strona główna",
  },
] satisfies { href: Route; title: string }[];

export const authNavItems = [
  { href: "/dashboard", title: "Dashboard", icon: BarChart },

  {
    href: "/customers",
    title: "Klienci",
    icon: Users,
  },
  {
    href: "/treatments",
    title: "Zabiegi",
    icon: HeartHandshake,
  },
  {
    href: "/forms",
    title: "Formularze",
    icon: ClipboardEdit,
  },
] satisfies { href: Route; title: string; icon: LucideIcon }[];

export const marketingFeatures = [
  {
    icon: <BookUser className="h-10 w-10" />,
    title: "Klienci",
    body: <>Przechowywuj dane o swoich klientach.</>,
  },
  {
    icon: <HeartHandshake className="h-10 w-10" />,
    title: "Zabiegi",
    body: <>Przypisz formularze do zabiegów</>,
  },
  {
    icon: <FileQuestion className="h-10 w-10" />,
    title: "Formularze",
    body: (
      <>
        Zrezygnuj ze zbędnej papierologii. Twórz i wypełniaj ankiety w
        aplikacji.
      </>
    ),
  },
];

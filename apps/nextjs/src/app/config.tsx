import type { LucideIcon } from "lucide-react";
import type { Route } from "next";
import {
  BarChart,
  BookUser,
  CheckCircle,
  ClipboardEdit,
  FileQuestion,
  HeartHandshake,
  User,
  Users,
} from "lucide-react";

import type { Option } from "~/components/data-table-faceted-filter";

export const guestNavItems = [
  {
    href: "/",
    title: "Strona główna",
  },
] satisfies { href: Route; title: string }[];

export const authNavItems = [
  { href: "/dashboard", title: "Dashboard", icon: BarChart },

  {
    href: "/treatments",
    title: "Zabiegi",
    icon: HeartHandshake,
  },
  {
    href: "/customers",
    title: "Klienci",
    icon: Users,
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

export const statusOptions: Option[] = [
  { value: "0", label: "Przypisany do klienta", icon: User },
  { value: "1", label: "W trakcie", icon: ClipboardEdit },
  { value: "2", label: "Ukończony", icon: CheckCircle },
];

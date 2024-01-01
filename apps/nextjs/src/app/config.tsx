import type { Route } from "next";
import {
  BookUser,
  CalendarDays,
  FileQuestion,
  FlaskRound,
  Globe,
  HeartHandshake,
  Store,
} from "lucide-react";

export const guestNavItems = [
  {
    href: "/",
    title: "Strona główna",
  },
] satisfies { href: Route; title: string }[];

export const authNavItems = [
  ...guestNavItems,
  { href: "/dashboard", title: "Dashboard" },
  {
    href: "/customers",
    title: "Klienci",
  },
] satisfies { href: Route; title: string }[];

export const marketingFeatures = [
  {
    icon: <Store className="h-10 w-10" />,
    title: "Zarządzaj",
    body: (
      <>Zarządzaj swoimi gabinetami bez względu na to gdzie teraz jesteś.</>
    ),
  },
  {
    icon: <BookUser className="h-10 w-10" />,
    title: "Klienci",
    body: <>Przechowywuj dane o swoich klientach.</>,
  },
  {
    icon: <HeartHandshake className="h-10 w-10" />,
    title: "Zabiegi",
    body: <>Stwórz bazę swoich zabiegów.</>,
  },
  {
    icon: <FlaskRound className="h-10 w-10" />,
    title: "Produkty",
    body: <>Prowadź inwentarz swoich produktów.</>,
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
  {
    icon: <CalendarDays className="h-10 w-10" />,
    title: "Beauty plany",
    body: (
      <>
        Komponuj beauty plany, dzięki którym Twoim klientom będzie łatwiej
        codziennie dbać o swoją urodę.
      </>
    ),
  },
];

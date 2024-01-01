import { Balancer } from "react-wrap-balancer";

import { marketingFeatures } from "~/app/config";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { cn } from "~/lib/utils";

export const runtime = "edge";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center pt-48">
      <div className="z-10 min-h-[60vh] w-full max-w-4xl px-5 xl:px-0">
        <h1
          className="animate-fade-up from-foreground to-muted-foreground fill-mode-forwards bg-gradient-to-br bg-clip-text text-center text-4xl font-bold tracking-[-0.02em] text-transparent opacity-0 drop-shadow-sm md:text-7xl/[5rem]"
          style={{ animationDelay: "0.20s" }}
        >
          <Balancer>
            Wszystko czego potrzebujesz do zarządzania gabinetem
          </Balancer>
        </h1>
        <p
          className="animate-fade-up text-muted-foreground/80 fill-mode-forwards mt-6 text-center opacity-0 md:text-xl"
          style={{ animationDelay: "0.30s" }}
        >
          <Balancer>
            Reservue to aplikacja, która pomoze Ci w zarządzaniu Twoim
            gabinetem. Dzięki niej Twoje zycie stanie się prostsze i będziesz
            mógł się skupić na tym co naprawdę wazne.
          </Balancer>
        </p>
      </div>
      <div className="animate-fade-up my-16 w-full max-w-screen-lg gap-5 border-t p-5 xl:px-0">
        <h2 className="pt-4 text-center text-3xl font-bold md:text-4xl">
          Co daje Ci reservue?
        </h2>

        <p className="pb-8 pt-4 text-center text-lg">
          <Balancer>
            Reservue to aplikacja, która wspomoze pracę Twojego gabinetu beauty.
            Pozbądź się zbędnej papierologii, miej więcej czasu dla siebie.
          </Balancer>
        </p>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {marketingFeatures.map((feature) => (
            <Card key={feature.title} className={cn("p-2")}>
              <CardHeader>{feature.icon}</CardHeader>
              <CardContent className="space-y-2">
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription className="mt-2">
                  {feature.body}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}

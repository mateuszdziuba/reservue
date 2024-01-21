import { Suspense } from "react";
import Link from "next/link";
import { ClipboardEdit, FileStack, Sticker, Users } from "lucide-react";

// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";

import { auth } from "@reservue/auth";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { api } from "~/trpc/server";
import { DashboardShell } from "../components/dashboard-shell";
import { CalendarDateRangePicker } from "./_components/date-range-picker";
import { Overview } from "./_components/overview";
import { RecentCustomers } from "./_components/recent-customers";

export const runtime = "nodejs";

export default async function Dashboard() {
  // You don't need to fetch these here, just showing different usages
  // If you don't want the Suspense loading state, you could pass these
  // posts as props as use as initialData in the query.

  const data = await api.business.getStats();

  return (
    <>
      <DashboardShell
        title="Dashboard"
        description="Podsumowanie Twojej działalności"
        className="flex-1 space-y-4  "
        // headerAction={
        //   <div className="flex items-center space-x-2">
        //     <CalendarDateRangePicker />
        //     <Button>Download</Button>
        //   </div>
        // }
      >
        {/* <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics" disabled>
                Analytics
              </TabsTrigger>
              <TabsTrigger value="reports" disabled>
                Reports
              </TabsTrigger>
              <TabsTrigger value="notifications" disabled>
                Notifications
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4"> */}
        <div className="grid gap-4 md:grid-cols-2 ">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Liczba klientów
              </CardTitle>
              <Users className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{data.customerCount}</div>
              {/* <p className="text-muted-foreground text-xs">
                +20.1% from last month
              </p> */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Dodane formularze
              </CardTitle>
              <FileStack className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{data.formCount}</div>
              {/* <p className="text-muted-foreground text-xs">
                +180.1% from last month
              </p> */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Wypełnione formularze
              </CardTitle>
              <ClipboardEdit className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{data.customerFormCount}</div>
              {/* <p className="text-muted-foreground text-xs">
                +19% from last month
              </p> */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Oszczędzone kartki papieru
              </CardTitle>
              <Sticker className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{data.pageCount}</div>
              {/* <p className="text-muted-foreground text-xs">
                +201 since last hour
              </p> */}
            </CardContent>
          </Card>
        </div>
        {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>You made 265 sales this month.</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentCustomers />
            </CardContent>
          </Card>
        </div> */}
        {/* </TabsContent>
          </Tabs> */}
      </DashboardShell>
    </>
  );
}

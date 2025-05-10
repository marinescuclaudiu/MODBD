"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type CityData = {
  id_oras: number;
  nume_oras: string;
  metoda_plata: "card" | "numerar";
  vanzari: number;
  total_vanzari_oras: number;
  procent_metoda_plata: number;
};

const chartConfig = {
  card: {
    label: "Card Payments",
    color: "hsl(var(--chart-1))",
  },
  numerar: {
    label: "Cash Payments",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function CityPaymentChart() {
  const [cityLimit, setCityLimit] = useState<number | "all">(20);
  const { data, isLoading, isError } = useQuery<CityData[]>({
    queryKey: ["productSalesByPaymentMethod"],
    queryFn: async () => {
      const { data } = await axios.get(
        "http://localhost:3000/api/warehouse/productSalesByPaymentMethod"
      );
      return data;
    },
    refetchInterval: 30000,
  });

  // Transform and limit data
  const processedData = data
    ?.reduce((acc, curr) => {
      const existing = acc.find((item) => item.nume_oras === curr.nume_oras);
      if (existing) {
        existing[curr.metoda_plata] = curr.vanzari;
      } else {
        acc.push({
          nume_oras: curr.nume_oras,
          card: curr.metoda_plata === "card" ? curr.vanzari : 0,
          numerar: curr.metoda_plata === "numerar" ? curr.vanzari : 0,
          totalSales: curr.vanzari,
        });
      }
      return acc;
    }, [] as Array<{ nume_oras: string; card: number; numerar: number; totalSales: number }>)
    ?.sort((a, b) => b.totalSales - a.totalSales)
    ?.slice(0, cityLimit === "all" ? data.length : cityLimit);

  if (isLoading) {
    return <div className="text-center p-8">Loading payment data...</div>;
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="p-6 text-red-600">
          Error loading payment data
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div>
            <CardTitle>Payment Methods by City</CardTitle>
            <CardDescription>
              Top {cityLimit === "all" ? "all" : cityLimit} cities by sales
            </CardDescription>
          </div>
          <Select
            value={cityLimit.toString()}
            onValueChange={(value) =>
              setCityLimit(value === "all" ? "all" : parseInt(value))
            }
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">Top 10</SelectItem>
              <SelectItem value="20">Top 20</SelectItem>
              <SelectItem value="50">Top 50</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={processedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            accessibilityLayer
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="nume_oras"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.replace("Oras ", "")}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar
              dataKey="card"
              fill="var(--color-card)"
              radius={4}
              name="Card Payments"
            />
            <Bar
              dataKey="numerar"
              fill="var(--color-numerar)"
              radius={4}
              name="Cash Payments"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Live Payment Data <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing {processedData?.length || 0} cities, auto-updates every 30
          seconds
        </div>
      </CardFooter>
    </Card>
  );
}

// src/components/TopPerformingSubcategoriesPieChart.tsx
import axios from "axios";
import { Cell, Label, Pie, PieChart, Sector } from "recharts";
import { PieSectorDataItem } from "recharts/types/polar/Pie";
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
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

type SubcategoryData = {
  rank: number;
  subcategorie: string;
  valoare_totala: number;
};

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const fetchSubcategories = async (): Promise<SubcategoryData[]> => {
  const { data } = await axios.get<SubcategoryData[]>(
    "http://localhost:3000/api/warehouse/topSubcategories"
  );
  return data;
};

export function TopPerformingSubcategoriesPieChart() {
  const [activeIndex, setActiveIndex] = useState(0);

  const {
    data: chartData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["topSubcategories"],
    queryFn: fetchSubcategories,
    refetchInterval: 10000, // Auto-refresh every 30 seconds
    staleTime: 10000,
  });

  const dynamicChartConfig =
    chartData?.reduce(
      (acc, item, index) => ({
        ...acc,
        [item.subcategorie]: {
          label: item.subcategorie,
          color: COLORS[index % COLORS.length],
        },
      }),
      {} as ChartConfig
    ) ?? {};

  if (isLoading) {
    return (
      <Card className="flex flex-col w-[600px] min-h-[400px] justify-center items-center">
        <p className="mt-4 text-gray-600">Loading sales data...</p>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card className="flex flex-col w-[600px]">
        <CardContent className="p-6 text-red-600">
          Error loading sales data. Please try again later.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col w-[600px]">
      <CardHeader className="items-center pb-2">
        <CardTitle className="text-lg font-semibold">
          Top Product Categories
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Revenue distribution by category (auto-updates every 30 seconds)
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={dynamicChartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) => `${value.toLocaleString()} RON`}
                  hideLabel
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="valoare_totala"
              nameKey="subcategorie"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              stroke="none"
              activeIndex={activeIndex}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <Sector
                  {...props}
                  outerRadius={outerRadius + 5}
                  cornerRadius={8}
                />
              )}
              onMouseEnter={(_, index) => setActiveIndex(index)}
            >
              {chartData?.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
              <Label
                value="Total Sales"
                position="center"
                className="fill-foreground text-sm font-medium"
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>

      <CardFooter className="flex flex-wrap justify-center gap-4 p-4">
        {chartData?.map((item, index) => (
          <div key={item.subcategorie} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-sm">
              {item.subcategorie}
              <span className="ml-2 text-muted-foreground">
                ({item.valoare_totala.toLocaleString()} RON)
              </span>
            </span>
          </div>
        ))}
      </CardFooter>
    </Card>
  );
}

import axios from "axios";
import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
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
import { useEffect, useState } from "react";

const chartConfig = {
  city: {
    label: "Total Value",
    color: "hsl(var(--chart-1))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

type CityData = {
  rank: number;
  nume_oras: string;
  valoare_totala: number;
};

export default function TopPerformingCityBarChart() {
  const [chartData, setChartData] = useState<CityData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<CityData[]>(
          "http://localhost:3000/api/warehouse/topCities"
        );
        setChartData(response.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <CardTitle>Top Cities by Total Sales</CardTitle>
        <CardDescription>Highest performing cities</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ right: 30, left: 30 }}
            width={600}
            height={300}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="nume_oras"
              type="category"
              tickLine={false}
              axisLine={false}
              width={80}
              tick={{ fill: "hsl(var(--foreground))" }}
            />
            <XAxis
              type="number"
              hide
              domain={[0, (dataMax) => Math.ceil(dataMax * 1.1)]}
            />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <Bar
              dataKey="valoare_totala"
              fill="hsl(var(--primary))"
              radius={[0, 4, 4, 0]}
            >
              <LabelList
                dataKey="valoare_totala"
                position="right"
                formatter={(value: number) => `$${value.toLocaleString()}`}
                fill="hsl(var(--foreground))"
                fontSize={12}
              />
              <LabelList
                dataKey="nume_oras"
                position="insideLeft"
                offset={10}
                fill="hsl(var(--background))"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Top performing cities <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total sales value for top 5 cities
        </div>
      </CardFooter>
    </Card>
  );
}

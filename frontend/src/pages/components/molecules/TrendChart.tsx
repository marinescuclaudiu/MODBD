import { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const chartConfig = {
  valoare: {
    label: "Monthly Value",
    color: "hsl(var(--chart-1))",
  },
  media_3_luni: {
    label: "3-Month Average",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function TrendChart() {
  const [selectedCafenea, setSelectedCafenea] = useState(1);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/warehouse/averageSales"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Process data for selected cafenea
  const chartData = data
    .filter((item) => item.id_cafenea === selectedCafenea)
    .map((item) => ({
      month: monthNames[item.luna - 1],
      valoare: item.valoare,
      media_3_luni: item.media_3_luni,
    }));

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>
              Monthly values and 3-month average
            </CardDescription>
          </div>
          <Select
            value={String(selectedCafenea)}
            onValueChange={(v) => setSelectedCafenea(Number(v))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select cafe" />
            </SelectTrigger>
            <SelectContent>
              {Array.from(new Set(data.map((item) => item.id_cafenea))).map(
                (id) => (
                  <SelectItem key={id} value={String(id)}>
                    Cafe {id}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="valoare"
              type="natural"
              stroke="var(--color-valoare)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="media_3_luni"
              type="natural"
              stroke="var(--color-media_3_luni)"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing monthly revenue and 3-month moving average for Cafe{" "}
          {selectedCafenea}
        </div>
      </CardFooter>
    </Card>
  );
}

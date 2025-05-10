"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
  pret_unitar: {
    label: "Unit Price",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function MostExpensiveChart() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/warehouse/mostExpensiveProduct')
        if (!response.ok) throw new Error('Failed to fetch data')
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Expensive Products by Category</CardTitle>
        <CardDescription>Unit prices for premium products across categories</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            width={800}
            height={400}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="subcategorie"
              angle={-45}
              textAnchor="end"
              tickMargin={20}
              interval={0}
            />
            <YAxis />
            <Tooltip
              content={<ChartTooltipContent />}
              cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
            />
            <Bar
              dataKey="pret_unitar"
              fill="var(--color-pret_unitar)"
              radius={[4, 4, 0, 0]}
              maxBarSize={80}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="text-sm text-muted-foreground">
          Showing highest priced product from each subcategory
        </div>
      </CardFooter>
    </Card>
  )
}
import { useEffect, useState } from "react";
import axios from "axios";
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
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

interface Category {
  id: number;
  denumire: string;
}

interface Subcategory {
  id: number;
  nume: string;
  id_categorie: number;
}

interface Product {
  id_produs: number;
  denumire: string;
  pret: number;
  id_subcategorie: number;
}

export default function CategoryPriceChart() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Process data to get average prices
  const processData = () => {
    const categoryMap = new Map<number, { sum: number; count: number }>();

    // Initialize categories
    categories.forEach((category) => {
      categoryMap.set(category.id, { sum: 0, count: 0 });
    });

    // Calculate sums and counts
    products.forEach((product) => {
      const subcategory = subcategories.find(
        (sub) => sub.id === product.id_subcategorie
      );
      if (subcategory) {
        const categoryData = categoryMap.get(subcategory.id_categorie);
        if (categoryData) {
          categoryMap.set(subcategory.id_categorie, {
            sum: categoryData.sum + product.pret,
            count: categoryData.count + 1,
          });
        }
      }
    });

    // Create chart data
    return categories.map((category) => {
      const data = categoryMap.get(category.id);
      const average = data && data.count > 0 ? data.sum / data.count : 0;
      return {
        category: category.denumire,
        averagePrice: Math.round(average * 100) / 100, // Round to 2 decimals
      };
    });
  };

  const chartData = processData();

  // Chart configuration
  const chartConfig = {
    averagePrice: {
      label: "Average Price",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, subcategoriesRes, productsRes] =
          await Promise.all([
            axios.get<Category[]>("http://localhost:3000/api/categories"),
            axios.get<Subcategory[]>("http://localhost:3000/api/subcategories"),
            axios.get<Product[]>("http://localhost:3000/api/products"),
          ]);

        setCategories(categoriesRes.data);
        setSubcategories(subcategoriesRes.data);
        setProducts(productsRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <CardTitle>Average Product Prices by Category</CardTitle>
        <CardDescription>
          Showing average prices across different product categories
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            data={chartData}
            margin={{ left: 20, right: 20 }}
            width={600}
            height={300}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="category"
              tickLine={false}
              axisLine={false}
              interval={0}
            />
            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
            <Area
              type="monotone"
              dataKey="averagePrice"
              stroke="hsl(var(--chart-1))"
              fill="hsl(var(--chart-1))"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="text-sm text-muted-foreground">
          Data calculated from {products.length} products across{" "}
          {categories.length} categories
        </div>
      </CardFooter>
    </Card>
  );
}

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

type ProductData = {
  rank: number;
  id_produs: number;
  denumire: string;
  valoare: number;
};

type QueryParams = {
  trimestru: number;
  an: number;
};

type Category = {
  id: number;
  denumire: string;
};

type Subcategory = {
  id: number;
  id_categorie: number;
  denumire: string;
};

type Product = {
  id: number;
  id_subcategorie: number;
  denumire: string;
};

const chartConfig = {
  products: {
    label: "Product Value",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const fetchTopProducts = async ({
  trimestru,
  an,
}: QueryParams): Promise<ProductData[]> => {
  const { data } = await axios.post<ProductData[]>(
    "http://localhost:3000/api/warehouse/topProductSales",
    { trimestru, an }
  );
  return data;
};

export function TopPerformingProductBarChart() {
  const [params, setParams] = React.useState<QueryParams>({
    trimestru: 1,
    an: new Date().getFullYear(),
  });
  const [selectedCategory, setSelectedCategory] = useState<number>();
  const [selectedProduct, setSelectedProduct] = useState<number>();

  const {
    data: chartData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["topProductSales", params],
    queryFn: () => fetchTopProducts(params),
    refetchInterval: 30000,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () =>
      axios
        .get<Category[]>("http://localhost:3000/api/categories")
        .then((res) => res.data),
  });

  const { data: subcategories } = useQuery({
    queryKey: ["subcategories"],
    queryFn: () =>
      axios
        .get<Subcategory[]>("http://localhost:3000/api/subcategories")
        .then((res) => res.data),
  });

  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: () =>
      axios
        .get<Product[]>("http://localhost:3000/api/products")
        .then((res) => res.data),
  });

  const selectedSubcategories = React.useMemo(
    () => subcategories?.filter((sub) => sub.id_categorie === selectedCategory),
    [subcategories, selectedCategory]
  );

  const selectedProducts = React.useMemo(
    () =>
      products?.filter((p) =>
        selectedSubcategories?.some((sub) => sub.id === p.id_subcategorie)
      ),
    [products, selectedSubcategories]
  );

  const filteredByCategory = React.useMemo(() => {
    if (!selectedCategory || !chartData || !products || !subcategories)
      return chartData;
    return chartData.filter((productData) => {
      const product = products.find((p) => p.id === productData.id_produs);
      if (!product) return false;
      const subcategory = subcategories.find(
        (s) => s.id === product.id_subcategorie
      );
      return subcategory?.id_categorie === selectedCategory;
    });
  }, [chartData, selectedCategory, products, subcategories]);

  const filteredData = React.useMemo(() => {
    if (!filteredByCategory) return [];
    if (!selectedProduct) return filteredByCategory;
    return filteredByCategory.filter(
      (product) => product.id_produs === selectedProduct
    );
  }, [filteredByCategory, selectedProduct]);

  const total = React.useMemo(
    () => filteredData?.reduce((acc, curr) => acc + curr.valoare, 0) || 0,
    [filteredData]
  );

  const handleQuarterChange = (value: string) => {
    setParams((prev) => ({ ...prev, trimestru: Number(value) }));
  };

  const handleYearChange = (value: string) => {
    setParams((prev) => ({ ...prev, an: Number(value) }));
  };

  if (isLoading) {
    return <h1> Loading...</h1>;
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="p-6 text-red-600">
          Error loading product data. Please try again later.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-4 p-6 border-b sm:flex-row sm:space-y-0 sm:gap-4">
        <div className="flex-1">
          <CardTitle>Top Products by Sales</CardTitle>
          <CardDescription>
            Highest performing products (auto-updates every 30 seconds)
          </CardDescription>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex flex-col gap-2">
            <Label>Category</Label>
            <Select
              value={selectedCategory?.toString()}
              onValueChange={(value) => {
                setSelectedCategory(Number(value));
                setSelectedProduct(undefined);
              }}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.denumire}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Product</Label>
            <Select
              value={selectedProduct?.toString()}
              onValueChange={(value) => setSelectedProduct(Number(value))}
              disabled={!selectedCategory}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                {selectedProducts?.map((product) => (
                  <SelectItem key={product.id} value={product.id.toString()}>
                    {product.denumire}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Year</Label>
            <Select
              value={params.an.toString()}
              onValueChange={handleYearChange}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() - i;
                  return (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>Quarter</Label>
            <Select
              value={params.trimestru.toString()}
              onValueChange={handleQuarterChange}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4].map((q) => (
                  <SelectItem key={q} value={q.toString()}>
                    Q{q}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-end">
          <div className="text-right">
            <span className="text-xs text-muted-foreground">
              Total Sales Value
            </span>
            <span className="text-lg font-bold leading-none sm:text-3xl">
              {total.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <ChartContainer config={chartConfig} className="h-[500px] w-full">
          <BarChart
            data={filteredData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            layout="horizontal"
            width={800}
            height={500}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="denumire"
              type="category"
              angle={-90}
              textAnchor="end"
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tickFormatter={(value) =>
                value.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })
              }
            />
            <Bar
              dataKey="valoare"
              fill="hsl(var(--chart-1))"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

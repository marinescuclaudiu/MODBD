import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CaffeList from "./CaffeList";
import ProductList from "./ProductsList";

export default function Home() {
  return (
    <Tabs defaultValue="cafenele" className="w-screen h-screen">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="cafenele">Cafenele</TabsTrigger>
        <TabsTrigger value="produse">Produse</TabsTrigger>
      </TabsList>
      <TabsContent value="cafenele">
        <CaffeList />
      </TabsContent>
      <TabsContent value="produse">
        <ProductList />
      </TabsContent>
    </Tabs>
  );
}

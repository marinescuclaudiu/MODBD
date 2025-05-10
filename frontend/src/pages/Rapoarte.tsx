import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CityPaymentChart } from "./components/molecules/CityPaymentChart";
import TopPerformingCityBarChart from "./components/molecules/TopPerformingCityBarChart";
import { TopPerformingProductBarChart } from "./components/molecules/TopPerformingProductBarChar";
import { TopPerformingSubcategoriesPieChart } from "./components/molecules/TopPerformingSubcategoriesPieChart";
import { TrendChart } from "./components/molecules/TrendChart";
import { MostExpensiveChart } from "./components/molecules/MostExpensiveChart";
import axios from "axios";
import { Button } from "@/components/ui/button";

export default function Rapoarte() {
  const syncDW = async () => {
    axios
      .post("http://localhost:3000/api/warehouse/update")
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="flex flex-col gap-10">
      <Button onClick={syncDW}>SYNC DW</Button>
      <ScrollArea>
        <div className="flex">
          <MostExpensiveChart />
          <TopPerformingCityBarChart />
          <TopPerformingSubcategoriesPieChart />
          <CityPaymentChart />
          <TrendChart />
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <TopPerformingProductBarChart />
    </div>
  );
}

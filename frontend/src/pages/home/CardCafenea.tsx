import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CoffeeIcon, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ICafenea {
  id: string;
  id_cafenea: number;
  judet: string;
  numar: string;
  nume_cafenea: string;
  oras: string;
  regiune: string;
  strada: string;
}

interface CardCafeneaProps {
  cafenea: ICafenea;
}

export default function CardCafenea({ cafenea }: CardCafeneaProps) {
  console.log("🚀 ~ CardCafenea ~ cafenea:", cafenea)
  const navigate = useNavigate();

  // Handle "Manage" button click
  const handleManageClick = () => {
    navigate(`/cafenea/${cafenea.id_cafenea}`);
  };
  const handleSettingsClick = () => {
    navigate(`/cafenea/${cafenea.id_cafenea}/settings`);
  };
  return (
    <Card className="w-[380px] border-2 border-red-500">
      <CardHeader className="flex">
        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-2">

            <CoffeeIcon />
            <CardTitle>{cafenea.nume_cafenea}</CardTitle>
          </div>
          <Settings onClick={handleSettingsClick} />
        </div>
        <CardDescription>{cafenea.strada} nr. {cafenea.numar} {cafenea.oras}, {cafenea.judet}, {cafenea.regiune} </CardDescription>
      </CardHeader>
      <CardFooter onClick={handleManageClick}>
        <Button className="w-full">Manage</Button>
      </CardFooter>
    </Card>
  );
}

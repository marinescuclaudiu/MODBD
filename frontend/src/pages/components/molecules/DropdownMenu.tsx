import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProdusComanda } from "@/pages/Cafenea";
import axios from "axios";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";

const formatDate = (date = new Date()) => {
  const day = String(date.getDate()).padStart(2, "0"); // Ziua cu 2 cifre
  const month = date
    .toLocaleString("default", { month: "short" })
    .toUpperCase(); // Luna prescurtată (uppercase)
  const year = String(date.getFullYear()).slice(-2); // Ultimele 2 cifre ale anului
  return `${day}-${month}-${year}`;
};

export function DropdownMenuDemo({
  cart,
  idCafenea,
  setCart,
}: {
  cart: ProdusComanda[];
  idCafenea: string | undefined;
  setCart: (cart: ProdusComanda[]) => void;
}) {
  const [date, setDate] = useState(formatDate());

  const handleCheckout = () => {
    cart.map((produs) => {
      produs.cantitate = parseInt(produs.cantitate.toString());
      produs.pret = produs.pret;
    });

    setCart([]);

    axios
      .post("http://localhost:3000/orders", {
        id_client: localStorage.getItem("id_client"),
        id_cafenea: idCafenea,
        products: cart,
      })
      .then((res) => {
        console.log("🚀 ~ handleCheckout ~ client:", localStorage.getItem("id_client"))
        console.log("🚀 ~ handleCheckout ~ id_cafe:", idCafenea)
        console.log("🚀 ~ handleCheckout ~ produse:", cart)
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <ShoppingCart />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Cart</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {cart.map((produs, index) => (
            <DropdownMenuItem key={index}>
              <div className="flex items-center justify-between">
                <span>
                  {produs.nume_produs} - {produs.pret} - {produs.cantitate} buc
                </span>
              </div>
            </DropdownMenuItem>
          ))}
          <div className="flex flex-col">
            <span>
              Pret total:
              {cart.reduce(
                (acc, produs) => acc + produs.pret * produs.cantitate,
                0
              )}
            </span>
            <span>Data Plasarii: {date}</span>
          </div>
          {cart.length !== 0 && (
            <Button className="w-full" onClick={handleCheckout}>
              Checkout
            </Button>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import axios from "axios";
import { DropdownMenuDemo } from "./components/molecules/DropdownMenu";

export interface Produs {
  id_produs: number;
  nume_produs: string;
  dimensiune: string;
  unitate_masura: string;
  pret: number;
  activ: string;
}

export interface ProdusComanda extends Produs {
  cantitate: number;
}

export default function CafeneaDetail() {
  const { id_cafenea } = useParams(); // Access the id_cafenea from the URL parameter
  const [cart, setCart] = useState<ProdusComanda[]>([]);
  const [produse, setProduse] = useState<Produs[]>([]);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Schimbă portul 3000 cu portul real al backend-ului tău (probabil 3001)
        const [productsRes] =
          await Promise.all([
            axios.get("http://localhost:3000/products"),
          ]);

        setProduse(productsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array = runs once on mount

  const addToCart = (produs: Produs) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === produs.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === produs.id
            ? { ...item, cantitate: item.cantitate + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...produs, cantitate: 1 }];
      }
    }
    )
  };

  return (
    <div className="p-6 bg-amber-50 text-gray-900 ">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-amber-900 mb-6">
          Details for Cafenea {id_cafenea} - { }
        </h1>
        <DropdownMenuDemo
          cart={cart}
          idCafenea={id_cafenea}
          setCart={setCart}
        />
        <Button
          variant="outline"
          className="bg-amber-600 text-white hover:bg-amber-700 rounded"
          onClick={() => history.back()}
        >
          Go Back
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {produse.map((produs) => (
          <div key={produs.id_produs} className="border p-4 rounded shadow-md bg-white">
            <h2 className="text-xl font-semibold">{produs.nume_produs}</h2>
            <p className="text-gray-700">Price: {produs.pret} RON</p>
            <p className="text-gray-700">Size: {produs.dimensiune}</p>
            <Button
              variant="outline"
              className="bg-amber-600 text-white hover:bg-amber-700 rounded mt-2"
              onClick={() => addToCart(produs)}
            >
              Add to Cart
            </Button>
          </div>
        ))}


      </div>
    </div>
  );
}

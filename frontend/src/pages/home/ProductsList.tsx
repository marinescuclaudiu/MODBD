import axios from "axios";
import { Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Produs } from "../Cafenea";
import { DialogAdaugareProdus } from "./AdaugareProdus";
import { DialogModificareProdus } from "./ModificareProdus";

export default function ProductList() {

    const [produse, setProduse] = useState<Produs[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
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

    const handleDeleteProduct = (id: number) => {
        axios.delete(`http://localhost:3000/products/${id}`)
            .then((res) => {
                console.log(res.data);
                setProduse(produse.filter((produs: any) => produs.id_produs !== id));
            })
            .catch((err) => {
                console.error(err);
            })
    }

    return (
        <div>

            <DialogAdaugareProdus />
            <div className="w-screen h-screen flex flex-wrap gap-4 p-4">
                {produse.map((produs: Produs) => (
                    <div key={produs.id_produs} className="flex flex-col w-[300px] h-[100px] items-center justify-center gap-2 border-2 border-gray-200">
                        <div className="flex justify-between items-center w-full p-2">
                            <h2 className="text-lg font-semibold">{produs.nume_produs}</h2>
                            <div className="flex gap-2 justify-center items-center">
                                <DialogModificareProdus id_produs={produs.id_produs} denumireProdus={produs.nume_produs} dimensiuneProdus={produs.dimensiune} unitateMasuraProdus={produs.unitate_masura} pretProdus={produs.pret} />
                                <Trash className="bg-red-500 rounded-full p-2 h-8 w-8" onClick={() => handleDeleteProduct(produs.id_produs)} />
                            </div>
                        </div>
                        <div className="flex gap-4 items-start justify-center">
                            <p className="text-gray-600">{produs.dimensiune}</p>
                            <p className="text-gray-600">{produs.unitate_masura}</p>
                            <p className="text-gray-600">{produs.pret} RON</p>
                            <p className="text-gray-600">{produs.activ}</p>
                        </div>
                    </div>))}
            </div>
        </div>
    )
}
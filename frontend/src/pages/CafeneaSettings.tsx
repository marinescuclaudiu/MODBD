import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DialogAdaugareAngajat } from "./components/molecules/AdaugareAngajat";
import { Minus } from "lucide-react";
import { DialogModificareInventar } from "./components/molecules/ModificareInventar";

export interface Angajat {
    id_angajat: number,
    nume: string,
    prenume: string,
    data_angajarii: string,
    salariu: number,
    id_cafenea: number,
    nume_cafenea: string,
    regiune: string
}

export interface CafeInventar {
    id_cafenea: number,
    nume_cafenea: string,
    id_materie: number,
    nume_materie: string,
    cantitate: number,
}

export interface Order {
    orderId: number,
    data_plasarii: string,
    id_client: number,
    id_cafenea: number,
    products: {
        id_produs: number,
        cantitate: number,
        pret_final: number
    }[]
}


export default function CafeneaSettings() {
    const { id_cafenea } = useParams();

    const [angajati, setAngajati] = useState<Angajat[]>([]);
    const [cafeInventories, setCafeInventories] = useState<CafeInventar[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Schimbă portul 3000 cu portul real al backend-ului tău (probabil 3001)
                const [angajatiRes, , cafeInventoriesRes, ordersRes] =
                    await Promise.all([
                        axios.get("http://localhost:3000/employee"),
                        axios.get("http://localhost:3000/products"),
                        axios.get("http://localhost:3000/cafeInventories"),
                        axios.get("http://localhost:3000/orders"),
                    ]);

                setAngajati(angajatiRes.data.filter((angajat: Angajat) => angajat.id_cafenea == Number(id_cafenea)));
                setCafeInventories(cafeInventoriesRes.data.filter((cafeInventory: CafeInventar) => cafeInventory.id_cafenea === Number(id_cafenea)));
                setOrders(ordersRes.data.filter((order: Order) => order.id_cafenea == Number(id_cafenea)));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
        console.log("🚀 ~ fetchData ~ orders:", orders)
    }, []); // Empty dependency array = runs once on mount


    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <ScrollArea className="h-[90%] w-[350px] rounded-md border p-4">
                <h1 className="sticky text-2xl font-bold mb-4 flex justify-center items-center gap-4">Angajatii Cafenelei
                    <DialogAdaugareAngajat id_cafenea={id_cafenea} />
                </h1>

                {angajati.map((angajat: Angajat) => (
                    <div key={angajat.nume} className="mb-2 p-2 border rounded-md bg-gray-100">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold">{angajat.nume} {angajat.prenume}</h2>
                        </div>
                        <p className="text-sm text-gray-600">ID: {angajat.id_angajat}</p>
                        <p className="text-sm text-gray-600">Cafenea: {angajat.nume_cafenea} {angajat.id_cafenea}</p>
                    </div>))}
            </ScrollArea>

            <ScrollArea className="h-[90%] w-[350px] rounded-md border p-4">
                <h1 className="sticky text-2xl font-bold mb-4 flex justify-center items-center gap-4">Inventarul Cafenelei
                    <DialogAdaugareAngajat id_cafenea={id_cafenea} />
                </h1>
                {
                    cafeInventories.map((cafeInventory: CafeInventar) => (
                        <div key={cafeInventory.id_materie} className="mb-2 p-2 border rounded-md bg-gray-100">
                            <div className="flex justify-between">
                                <h2 className="text-lg font-semibold">{cafeInventory.nume_materie}</h2>
                                <div className="flex gap-2 justify-center items-center">
                                    <DialogModificareInventar id_cafenea={cafeInventory.id_cafenea} id_materie={cafeInventory.id_materie} cantitate={cafeInventory.cantitate} />
                                    <Minus className="bg-red-500 w-8 h-8 p-1 rounded-full" onClick={() => { axios.delete(`http://localhost/cafeInvetories/${cafeInventory.id_materie}/${cafeInventory.id_cafenea}`) }} />
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">ID: {cafeInventory.id_materie}</p>
                            <p>ID CAFENEA: {cafeInventory.id_cafenea}</p>
                            <p className="text-sm text-gray-600">Cantitate: {cafeInventory.cantitate}</p>
                        </div>))
                }
            </ScrollArea>

            <ScrollArea className="h-[90%] w-[350px] rounded-md border p-4">
                <h1 className="sticky text-2xl font-bold mb-4">Comenzi</h1>
                {orders.map((order: Order) => (
                    <div key={order.orderId} className="mb-2 p-2 border rounded-md bg-gray-100">
                        <h2 className="text-lg font-semibold">Comanda ID: {order.orderId}</h2>
                        <p className="text-sm text-gray-600">Data plasarii: {order.data_plasarii}</p>
                        <p className="text-sm text-gray-600">ID Client: {order.id_client}</p>
                        <p className="text-sm text-gray-600">ID Cafenea: {order.id_cafenea}</p>
                        <div className="mt-2">
                            {order.products.map((produs) => (
                                <div key={produs.id_produs} className="mb-1 p-1 border rounded-md bg-gray-200">
                                    <p>ID Produs: {produs.id_produs}</p>
                                    <p>Cantitate: {produs.cantitate}</p>
                                    <p>Pret final: {produs.pret_final}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </ScrollArea>
        </div>
    )
}
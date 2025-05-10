import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import CardCafenea from "./CardCafenea";
import axios from "axios";
import { useState, useEffect } from "react";

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

export default function CaffeList() {
    const [cafenea, setCafenea] = useState<ICafenea[]>([]);
    const [selectedRegion, setSelectedRegion] = useState<string>("global");


    useEffect(() => {
        const fetchData = async () => {
            try {
                // Schimbă portul 3000 cu portul real al backend-ului tău (probabil 3001)
                const [cafeneaRes] = await Promise.all([
                    axios.get("http://localhost:3000/cafes"),
                ]);

                setCafenea(cafeneaRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []); // Empty dependency array = runs once on mount

    const filteredCafenele = cafenea.filter((c) => {
        if (selectedRegion === "global") return true;
        if (selectedRegion === "bucuresti") return c.regiune === "Bucuresti-Ilfov";
        if (selectedRegion === "provincie") return c.regiune !== "Bucuresti-Ilfov";
        return true;
    });
    return (
        <div className="h-screen w-screen flex flex-col justify-center items-center">
            <Select onValueChange={setSelectedRegion} defaultValue="global">
                <SelectTrigger className="w-[180px] mb-10">
                    <SelectValue placeholder="Selecteaza o regiune" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Regiuni</SelectLabel>
                        <SelectItem value="global">Global</SelectItem>
                        <SelectItem value="bucuresti">Bucuresti</SelectItem>
                        <SelectItem value="provincie">Provincie</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>

            <ScrollArea className="h-[90%] rounded-md border flex w-[62%] p-2">
                <div className="flex gap-4 flex-wrap">

                    {filteredCafenele.map((cafenea) => (
                        <CardCafenea key={cafenea.id} cafenea={cafenea} />
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from "axios"
import { Edit } from "lucide-react"
import { useState } from "react"

export function DialogModificareProdus({ id_produs, denumireProdus, dimensiuneProdus, unitateMasuraProdus, pretProdus }: { id_produs: string | number, denumireProdus: string, dimensiuneProdus: string, unitateMasuraProdus: string, pretProdus: number }) {

    const [denumire, setDenumire] = useState(denumireProdus || "");
    const [dimensiune, setDimensiune] = useState(dimensiuneProdus || "");
    const [unitateMasura, setUnitateMasura] = useState(unitateMasuraProdus || "");
    const [pret, setPret] = useState(pretProdus || 0);


    const handleAddProduct = (id: string | number) => {
        // Implement the logic to add an employee here
        axios.put(`http://localhost:3000/products/${id}`, {
            nume_produs: denumire,
            dimensiune,
            unitate_masura: unitateMasura,
            pret,
        })
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => {
                console.error(err);
            })

        console.log("Adaugare produs");
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Edit />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Adauga Produs</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="nume_produs" className="text-right">
                            Denumire
                        </Label>
                        <Input
                            id="nume_produs"
                            placeholder="Denumire"
                            className="col-span-3"
                            onChange={(e) => setDenumire(e.target.value)}
                            value={denumire}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="dimensiune" className="text-right">
                            Dimensiune
                        </Label>
                        <Input
                            id="dimensiune"
                            placeholder="Dimensiune"
                            className="col-span-3"
                            onChange={(e) => setDimensiune(e.target.value)}
                            value={dimensiune}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="unitateMasura" className="text-right">
                            Unitate Masura
                        </Label>
                        <Input
                            id="unitateMasura"
                            placeholder="Unitate Masura"
                            className="col-span-3"
                            onChange={(e) => setUnitateMasura(e.target.value)}
                            value={unitateMasura}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="pret" className="text-right">
                            Pret
                        </Label>
                        <Input
                            id="pret"
                            placeholder="Pret"
                            className="col-span-3"
                            type="number"
                            onChange={(e) => setPret(parseFloat(e.target.value))}
                            value={pret}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={() => handleAddProduct(id_produs)}>Adauga Produs</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

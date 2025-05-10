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
import { PlusCircle } from "lucide-react"
import { useState } from "react"

export function DialogAdaugareProdus() {

    const [denumire, setDenumire] = useState("");
    const [dimensiune, setDimensiune] = useState("");
    const [unitateMasura, setUnitateMasura] = useState("");
    const [pret, setPret] = useState(0);


    const handleAddProduct = () => {
        // Implement the logic to add an employee here
        axios.post("http://localhost:3000/products", {
            nume_produs: denumire,
            dimensiune,
            unitate_masura: unitateMasura,
            pret,
        })
            .then((res) => {
                console.log(res.data);
                // Reset the form fields after successful submission
                setDenumire("");
                setDimensiune("");
                setUnitateMasura("");
                setPret(0);
            })
            .catch((err) => {
                console.error(err);
            })

        console.log("Adaugare produs");
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="">  Adauga un nou Produs <PlusCircle className="cursor-pointer" size={20} /></Button>

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
                            onChange={(e) => setPret(parseFloat(e.target.value))}
                            value={pret}
                            type="number"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleAddProduct}>Adauga Produs</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

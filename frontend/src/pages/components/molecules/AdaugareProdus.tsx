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


    const handleAddEmployee = () => {
        // Implement the logic to add an employee here
        axios.post("http://localhost:3000/products", {
            denumire,
            dimensiune,
            unitateMasura,
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
                <PlusCircle className="cursor-pointer" size={20} />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Adauga Produst</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="denumire" className="text-right">
                            Denumire
                        </Label>
                        <Input
                            id="denumire"
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
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleAddEmployee}>Adauga Produs</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

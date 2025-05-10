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
import axios from "axios"
import { Edit } from "lucide-react"
import { useState } from "react"

export function DialogModificareInventar({ id_cafenea, id_materie, cantitate }: { id_cafenea: string | number, id_materie: number, cantitate: number }) {
    const [cantitateNoua, setCantitateNoua] = useState(cantitate);


    const handleAddEmployee = () => {
        // Implement the logic to add an employee here
        axios.put("http://localhost:3000/cafeIntentory", {
            id_cafenea: id_cafenea,
            id_materie: id_materie,
            cantitate: cantitateNoua
        })
            .then((res) => {
                console.log(res.data);
                // Reset the form fields after successful submission
            })
            .catch((err) => {
                console.error(err);
            })

        console.log("Adaugare angajat");
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Edit className="cursor-pointer" size={20} />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Modifica inventar</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Input
                            id="canitate"
                            placeholder="cantitate"
                            className="col-span-3"
                            type="number"
                            onChange={(e) => setCantitateNoua(Number(e.target.value))}
                            value={cantitateNoua}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleAddEmployee}>Modifica cantitate</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

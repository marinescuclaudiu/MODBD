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

export function DialogAdaugareAngajat({ id_cafenea }: { id_cafenea: string | undefined }) {

    const [nume, setNume] = useState("");
    const [prenume, setPrenume] = useState("");
    const [salariu, setSalariu] = useState(0);


    const handleAddEmployee = () => {
        // Implement the logic to add an employee here
        axios.post("http://localhost:3000/employee", {
            nume: nume,
            prenume: prenume,
            salariu: salariu,
            id_cafenea: id_cafenea
        })
            .then((res) => {
                console.log(res.data);
                // Reset the form fields after successful submission
                setNume("");
                setPrenume("");
                setSalariu(0);
            })
            .catch((err) => {
                console.error(err);
            })

        console.log("Adaugare angajat");
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <PlusCircle className="cursor-pointer" size={20} />
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Adauga angajat</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Nume
                        </Label>
                        <Input
                            id="name"
                            placeholder="Nume"
                            className="col-span-3"
                            onChange={(e) => setNume(e.target.value)}
                            value={nume}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="prenume" className="text-right">
                            Prenume
                        </Label>
                        <Input
                            id="prenume"
                            placeholder="Prenume"
                            className="col-span-3"
                            onChange={(e) => setPrenume(e.target.value)}
                            value={prenume}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="salariu" className="text-right">
                            Salariu
                        </Label>
                        <Input
                            id="salariu"
                            placeholder="Salariu"
                            className="col-span-3"
                            type="number"
                            onChange={(e) => setSalariu(parseInt(e.target.value))}
                            value={salariu}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleAddEmployee}>Adauga Angajat</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

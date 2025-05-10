import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    axios
      .post("http://localhost:3000/customers", {
        nume: e.target[0].value,
        prenume: e.target[1].value,
        email: e.target[2].value,
        password: e.target[3].value,
      })
      .then((response) => {
        console.log('a mers')
        navigate("/");
      }
      ).catch((error) => {
        alert("Login failed");
        console.log(error);
      });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>
            Introduceti datele pentru a va inregistra
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="nume">Nume</Label>
                <Input
                  id="nume"
                  placeholder="Nume"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="prenume">Prenume</Label>
                <Input id="prenume" required placeholder="Prenume" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="Email"
                  required
                  type="email"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="parola">Parola</Label>
                <Input
                  id="parola"
                  placeholder="Parola"
                  type="password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

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

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    var logged = false;
    axios
      .get("http://localhost:3000/api/customers")
      .then((response) => {
        const form = e.target as HTMLFormElement;
        console.log((form[0] as HTMLInputElement).value, (form[1] as HTMLInputElement).value);
        response.data.filter((customer: any) => {
          const form = e.target as HTMLFormElement;
          if (customer.email === (form[0] as HTMLInputElement).value && customer.password === (form[1] as HTMLInputElement).value) {
            localStorage.setItem("id_client", customer.id_client);
            logged = true;
            console.log("Login successful");
            navigate("/home");
          }
        })
        if (!logged) {
          alert("Login failed");
        }
      })
      .catch((error) => {
        alert("Login failed");
        console.log(error);
      });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Input id="password" type="password" required />
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

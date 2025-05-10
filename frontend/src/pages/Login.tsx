import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./components/molecules/LoginForm";
import { RegisterForm } from "./components/molecules/RegisterForm";
export default function Login() {
  return (
    <div className="w-screnn h-screen flex justify-center items-center">

      <Tabs defaultValue="cafenele" className="w-1/2 h-1/2">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="cafenele">Login</TabsTrigger>
          <TabsTrigger value="produse">Register</TabsTrigger>
        </TabsList>
        <TabsContent value="cafenele">
          <LoginForm />
        </TabsContent>
        <TabsContent value="produse">
          <RegisterForm />
        </TabsContent>
      </Tabs>
    </div>
  );
}

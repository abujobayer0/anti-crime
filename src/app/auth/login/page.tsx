import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Component() {
  return (
    <div className="flex justify-around h-screen items-center">
      <div className="w-full bg-primary flex justify-center items-center h-screen">
        <Image
          alt="image"
          src={"/anticrime-logo.png"}
          width={200}
          height={200}
        ></Image>
      </div>
      <div className="w-full flex justify-center ">
        <div className="max-w-sm">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>
                Please enter your username and password to login.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Your username"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full hover:bg-blue-500 transition-colors">
                Sign in
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

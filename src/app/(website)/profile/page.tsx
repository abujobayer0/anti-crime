"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FilePenLine, Target, Upload } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppSelector } from "@/redux/hooks";
import { getToken } from "@/redux/features/auth/authSlice";

type Inputs = {
  example: string;
  exampleRequired: string;
};

type Props = {};

const Page = (props: Props) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [address, setAddress] = useState("");
  const [profileImage, setProfileImage] = useState("")
  const token = useAppSelector(getToken)
  console.log(token)

  useEffect(() => {
    console.log("Token in Redux:", token);
  }, [token]);

  const handleSave = async() => {
    const data = {
      name,
      email,
      number,
      password,
      address,
      bio,
    };
    try{

    }catch(err){
      console.log(err)
    }
  };
  return (
    <div>
      <div className=" w-full flex flex-col items-center border-2  py-5 rounded-3xl ">
        <div className=" flex flex-col gap-4">
          <div className=" relative">
            <Avatar className=" w-[150px] h-[150px]">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>Profile Image</AvatarFallback>
            </Avatar>
            <div className=" absolute bottom-0 right-2 bg-slate-100 rounded-full p-2">
              <label htmlFor="doc">
                <p> <Upload /></p>
                <input type="file" onChange={(e)=>setProfileImage(e.target.value)}  accept="image/*" id="doc" name="doc" hidden />
              </label>
            </div>
          </div>
          <div>
            <h1 className=" text-3xl font-medium text-slate-700">User Name</h1>
          </div>
        </div>
        <div className=" max-w-[300px] text-center mt-2 text-base lg:text-base text-slate-700">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores
          </p>
        </div>
      </div>

      {/* contract information */}
      <div className=" flex flex-col justify-center items-center border-b-2 pb-3">
        <h1 className=" text-xl text-slate-600 font-semibold border-b-2 py-2 px-10">
          Contract Information
        </h1>
        <div>
          <ul className=" mt-2">
            <li className=" text-base font-semibold text-slate-600">
              Email:{" "}
              <span className=" text-base font-semibold text-slate-500">
                codeXpert@gmail.com
              </span>
            </li>
            <li className=" text-base font-semibold text-slate-600">
              Contract Number:{" "}
              <span className=" text-base font-semibold text-slate-500">
                017********
              </span>
            </li>
            <li className=" text-base font-semibold text-slate-600">
              Address:{" "}
              <span className=" text-base font-semibold text-slate-500">
                Naogaon Sadar, rajhshahi
              </span>
            </li>
          </ul>
          <div className=" flex justify-center">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className=" mt-2 text-base font-medium text-slate-600 "
                  variant="secondary"
                >
                  <span>
                    <FilePenLine />
                  </span>
                  Edit profile details
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Edit profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you're
                    done.
                  </DialogDescription>
                </DialogHeader>
                <form className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      defaultValue="user name"
                      className="col-span-3"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      className="col-span-3"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Number
                    </Label>
                    <Input
                      id="number"
                      className="col-span-3"
                      onChange={(e) => setNumber(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      className="col-span-3"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Bio
                    </Label>
                    <Input
                      id="bio"
                      type="text"
                      className="col-span-3"
                      onChange={(e) => setBio(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Address
                    </Label>
                    <Input
                      id="address"
                      type="text"
                      className="col-span-3"
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </form>
                <Button onClick={handleSave} type="submit">
                  Save changes
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* report list filed */}

      <div>
        <h3 className=" text-2xl font-semibold text-slate-500 py-4">
          Your Reports
        </h3>
        <div>
          <Table>
            <TableHeader>
              <TableRow className=" bg-slate-50">
                <TableHead className="w-[100px]">Report Title</TableHead>
                <TableHead className=" text-right">Location</TableHead>
                <TableHead className=" text-right">Date</TableHead>
                <TableHead className="text-right">Report Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className=" bg-slate-100">
                <TableCell className="font-medium">INV001</TableCell>
                <TableCell className=" text-right">Paid</TableCell>
                <TableCell className=" text-right">Credit Card</TableCell>
                <TableCell className="text-right">$250.00</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Page;

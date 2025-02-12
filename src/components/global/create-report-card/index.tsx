import { Button } from "@/components/ui/button";
import { Image, Sparkles } from "lucide-react";
import React from "react";
import { SelectComponent } from "../select-component";
import { SelectGroup, SelectItem, SelectLabel } from "@/components/ui/select";

type Props = {};

const CreateReportCard = (props: Props) => {
  return (
    <div className="w-full  border p-2  rounded-md shadow-sm">
      <div className="w-full flex gap-2 mb-4 justify-end">
        <SelectComponent
          content={
            <SelectGroup>
              <SelectLabel>Division</SelectLabel>
              <SelectItem value="pineapple">Pineapple</SelectItem>
            </SelectGroup>
          }
          selectValue="Division"
        />

        <SelectComponent
          content={
            <SelectGroup>
              <SelectLabel>District</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
            </SelectGroup>
          }
          selectValue="District"
        />
      </div>
      <textarea
        name="description"
        id="description"
        className="w-full h-24 border"
      ></textarea>
      <div className="flex w-full justify-between items-center">
        <div>
          <Button className="mt-4" variant={"ghost"}>
            <Sparkles />
          </Button>
          <Button className="mt-4" variant={"ghost"}>
            <Image />
          </Button>
        </div>
        <div>
          <Button>Submit Report</Button>
        </div>
      </div>
    </div>
  );
};

export default CreateReportCard;

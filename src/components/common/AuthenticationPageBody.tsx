import Image from "next/image";
import React, { ReactNode } from "react";
import bgShap from "../../../assets/shaps/auth-bg.png";
import { cn } from "@/lib/utils";

interface AuthenticationPageBodyProps {
  src: string;
  title: string;
  form: ReactNode;
  ltr: boolean;
}

const AuthenticationPageBody: React.FC<AuthenticationPageBodyProps> = ({
  src,
  title,
  form,
  ltr = false,
}) => {
  return (
    <div className={cn("flex h-screen w-full", ltr ? "flex-row" : "flex-row-reverse")}>
      {/* Left Section */}
      <div
        className={cn(
          " bg-cover bg-center bg-no-repeat flex items-center justify-end w-[60%] ",
          ltr ? "" : "scale-x-[-1]"
        )}
        style={{ backgroundImage: `url(${bgShap.src})` }}
      >
        <div>
          <Image className="" src={src} width={500} height={500} alt="registration-png" />
        </div>
      </div>

      {/* Right Section (Form) */}
      <div
        className={cn(
          " flex items-center justify-center w-[40%]"
        )}
      >
        <div className="w-[350px]">
          <h3 className="font-bold text-3xl text-primary mb-10 text-center">
            {title}
          </h3>

          {/* React Hook Form */}
          {form}
        </div>
      </div>
    </div>
  );
};

export default AuthenticationPageBody;

import Image from "next/image";
import React, { ReactNode } from "react";
import bgShap from "../../../assets/shaps/auth-bg.png";

interface AuthenticationPageBodyProps {
  src: string;
  title:string,
  form: ReactNode,
}

const AuthenticationPageBody: React.FC<AuthenticationPageBodyProps> = ({
  src,
  title,
  form,
}) => {
  return (
    <div className="flex h-screen w-full">
      {/* Left Section */}
      <div
        className="w-[60%] bg-cover bg-center bg-no-repeat flex items-center justify-end"
        style={{ backgroundImage: `url(${bgShap.src})` }}
      >
        <div>
          <Image src={src} width={500} height={500} alt="registration-png" />
        </div>
      </div>

      {/* Right Section (Form) */}
      <div className="w-[40%] flex items-center justify-center">
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

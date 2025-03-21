"use client";
import React from "react";
import Image from "next/legacy/image";
import Earth from "../global/globe";

interface Props {
  title: string;
  subtitle: string;
  form: React.ReactNode;
}

const AuthenticationPageBody = ({ title, subtitle, form }: Props) => {
  return (
    <div className="flex">
      <div className="w-full h-full absolute top-0 backdrop-blur-md left-0 z-10 bg-primary/10 mx-auto flex items-center justify-center">
        <div className="w-full bg-white shadow-sm p-8 rounded-lg max-w-lg space-y-8">
          <div className="flex items-center gap-3 justify-center lg:justify-start">
            <Image
              src="/anticrime-logo.png"
              width={48}
              height={48}
              alt="AntiCrime logo"
              className="rounded-xl"
            />
            <span className="font-bold text-2xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              AntiCrime
            </span>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>

          {form}
        </div>
      </div>

      <div className="hidden lg:flex w-full h-screen overflow-hidden">
        <div className="w-full opacity-30">
          <Earth />
        </div>
      </div>
    </div>
  );
};

export default AuthenticationPageBody;

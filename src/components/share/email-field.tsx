"use client";

import Image from "next/image";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

import { emailIcon } from "../../../public/assets/images/email-icon.png";
import FormError from "@/src/components/share/form-error";

interface EmailFieldProps {
  label: string;
  placeholder?: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
}

export default function EmailField({
  label,
  placeholder = "Enter your email",
  register,
  error,
}: EmailFieldProps) {
  return (
    <div className="flex flex-col ">
      <label className="lg-text-[16px] text-[14px] font-inter text-black w-full max-w-[350px] lg:max-w-[436px] mx-auto mb-1">
        {label}
      </label>
       {error && (
          <p className="text-red text-xs font-inter">;
          </p>
        )}
      <div className="relative w-full max-w-[350px] lg:max-w-[436px] mx-auto">
        <Image
          src={emailIcon}
          alt="Email Icon"
          width={13}
          height={13}
          className="absolute left-4 top-1/2 -translate-y-1/2 opacity-70 pointer-events-none"
        />
        <input
          type="email"
          placeholder={placeholder}
          {...register}
          className="w-full h-[39px] text-black  pl-9 pr-11 text-[13px]  font-inter border border-blue rounded-[8px] bg-transparent placeholder:text-dark-gray  focus:outline-none"
        />
      </div>
        <FormError message={error?.message} />
    </div>
  );
}

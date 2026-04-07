"use client";

import { useState, ReactNode } from "react";
import Image from "next/image";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

import { passwordIcon, offeyeIcon, oneyeIcon } from "@/public/assets";

interface PasswordFieldProps {
  label?: string | ReactNode;
  placeholder?: string;
  register: UseFormRegisterReturn;
  error?: FieldError;
  required?: boolean;
  showToggle?: boolean;
  showLeftIcon?: boolean;
}

export default function PasswordField({
  label = "Password",
  placeholder = "Enter your password",
  register,
  error,
  required = false,
  showToggle = true,
  showLeftIcon = true,
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center w-full max-w-[350px] lg:max-w-[436px] mx-auto">
        <label className="lg-text-[16px] text-[14px] font-inter text-black flex items-center gap-1">
          {label}
          {required && <span className="text-red">*</span>}
        </label>
      </div>

      <div className="relative w-full">
        {showLeftIcon && (
          <Image
            src={passwordIcon}
            alt="Password Icon"
            width={20}
            height={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 opacity-70 pointer-events-none"
          />
        )}

        {showToggle && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            <Image
              src={showPassword ? oneyeIcon : offeyeIcon}
              alt="Toggle Password"
              width={18}
              height={18}
              className="opacity-70"
            />
          </button>
        )}

        <input
          type={showToggle && showPassword ? "text" : "password"}
          placeholder={placeholder}
          {...register}
          className={`w-full 
            ${showLeftIcon ? "pl-9" : "pl-4"} 
            ${showToggle ? "pr-12" : "pr-4"} 
            text-[13px] border border-blue rounded-[8px] bg-transparent 
            placeholder:text-dark-gray text-black focus:outline-none  h-[39px] text-black `}
        />
      </div>
    </div>
  );
}

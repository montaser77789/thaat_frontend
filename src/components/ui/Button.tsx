import {  cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

const buttonVariants = cva(
  "rounded-md font-medium cursor-pointer text-white duration-300  disabled:cursor-not-allowed flex items-center justify-center",
  {
    variants: {
      variant: {
        default:
          "bg-primary  text-white py-2 px-4 rounded-lg hover:bg-primary/80 transition duration-200",
        cart:
          "bg-green-400 text-white py-2 px-4 rounded-full",
        danger:
          "bg-[#f20c0c] text-white flex justify-center gap-2 hover:opacity-80 cursor-pointer",
        cancel:
          "bg-gray-300 text-gray-700 flex justify-center gap-2 hover:opacity-80 cursor-pointer",
        outline:
          "border border-indigo-400 flex gap-2 justify-center text-black hover:text-white bg-transparent hover:border-transparent hover:bg-indigo-600 ",
      },
      size: {
        default: "p-3",
        sm: "text-sm px-4 py-2",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
  isloading?: boolean;
  type?: "submit" | "reset" | "button";
}

const Button = ({
  type,
  variant,
  size,
  fullWidth,
  className,
  children,
  isloading,
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      disabled={isloading}
      className={cn(buttonVariants({ variant, size, fullWidth, className }))}
      {...props}
    >
      {isloading && (
        <svg
          className="animate-spin h-5 w-5 text-white mr-2"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;

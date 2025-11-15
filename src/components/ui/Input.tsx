import { forwardRef, type InputHTMLAttributes, type Ref } from "react";

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  helperText?: string;
  label?: string;
  placeholder?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, IProps>(
  ({ error, helperText, icon, ...rest }: IProps, ref: Ref<HTMLInputElement>) => {
    return (
      <div className="relative">
        {rest.label && (
          <label className="font-bold text-gray-700 block mb-1">
            {rest.label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          <input
            dir="auto"
            ref={ref}
            placeholder={rest.placeholder}
            className={`border ${
              error ? "border-red-500" : "border-gray-300"
            } shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary rounded-lg px-3 py-2.5 text-md w-full bg-transparent ${
              icon ? "pl-10" : ""
            } ${rest.disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
            {...rest}
          />
        </div>
        {error && helperText && (
          <p className="text-red-500 text-sm mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
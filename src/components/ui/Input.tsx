import { forwardRef, type InputHTMLAttributes, type Ref } from "react";

interface IProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  helperText?: string;
  label?: string;
  placeholder?: string;
}

const Input = forwardRef<HTMLInputElement, IProps>(
  ({ error, helperText, ...rest }: IProps, ref: Ref<HTMLInputElement>) => {
    return (
      <div className="relative ">
        <label className="font-bold text-gray-700 ">{rest.label}</label>
        <input
          dir="auto"
          ref={ref}
          placeholder={rest.placeholder}
          className={`border ${
            error ? "border-red-500" : "border-gray-300"
          } shadow-lg focus:border-indigo-600 mt-1 text-left focus:outline-none focus:ring-1 focus:ring-indigo-600 rounded-lg px-2 py-3 text-md w-full bg-transparent`}
          {...rest}
        />
        {error && helperText && (
          <p className="text-red-500 text-sm mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

export default Input;

import { forwardRef, type SelectHTMLAttributes, type Ref } from "react";

interface IProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  helperText?: string;
  label?: string;
  placeholder?: string;
  options?: { value: string | number; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, IProps>(
  ({ error, helperText, label, placeholder, options = [], ...rest }, ref) => {
    return (
      <div className="relative">
        {label && (
          <label className="font-bold text-gray-700 block mb-1">{label}</label>
        )}

        <div className="relative">
          <select
            ref={ref}
            className={`appearance-none border ${
              error ? "border-red-500" : "border-gray-300"
            } shadow-lg focus:border-indigo-600 mt-1 text-left focus:outline-none focus:ring-1 focus:ring-indigo-600 rounded-lg px-2 py-3 text-md w-full bg-transparent pr-8`}
            dir="rtl"
            {...rest}
          >
            {placeholder && (
              <option hidden value="">
                {placeholder}
              </option>
            )}

            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
            ▼
          </div>
        </div>

        {error && helperText && (
          <p className="text-red-500 text-sm mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

export default Select;

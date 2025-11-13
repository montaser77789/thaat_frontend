import { forwardRef, type TextareaHTMLAttributes, type Ref } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  helperText?: string;
  label?: string;
  placeholder?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { error, helperText, label, placeholder, ...rest },
    ref: Ref<HTMLTextAreaElement>
  ) => {
    return (
      <div className="relative">
        {label && (
          <label className="font-bold text-gray-700 block mb-1">{label}</label>
        )}

        <textarea
          ref={ref}
          placeholder={placeholder}
          // dir="auto" يظبط الاتجاه والكيرسر حسب اللغة
          dir="auto"
          className={`border ${
            error ? "border-red-500" : "border-gray-300"
          } shadow-lg focus:border-indigo-600 mt-1 text-left focus:outline-none focus:ring-1 focus:ring-indigo-600 rounded-lg px-2 py-3 text-md w-full bg-transparent resize-y min-h-[120px]`}
          {...rest}
        />

        {error && helperText && (
          <p className="text-red-500 text-sm mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

export default Textarea;

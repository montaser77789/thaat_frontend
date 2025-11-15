import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

const buttonVariants = cva(
  "rounded-md font-medium cursor-pointer text-white duration-300 disabled:cursor-not-allowed flex items-center justify-center transition-all",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/80",
        cart:
          "bg-green-400 text-white py-2 px-4 rounded-full hover:bg-green-500",
        danger:
          "bg-[#f20c0c] text-white flex justify-center gap-2 hover:opacity-80 cursor-pointer hover:bg-red-700",
        cancel:
          "bg-gray-300 text-gray-700 flex justify-center gap-2 hover:opacity-80 cursor-pointer hover:bg-gray-400",
        outline:
          "border border-indigo-400 flex gap-2 justify-center text-black hover:text-white bg-transparent hover:border-transparent hover:bg-indigo-600",
        ghost:
          "bg-transparent text-gray-700 hover:bg-gray-100 border border-transparent hover:border-gray-200",
        link:
          "bg-transparent text-blue-600 hover:text-blue-800 hover:underline p-0 h-auto",
      },
      size: {
        default: "p-3 text-base",
        sm: "px-3 py-2 text-sm",
        lg: "px-6 py-3 text-lg",
        xl: "px-8 py-4 text-xl",
        icon: "p-2", // حجم للأيقونة فقط
        "icon-sm": "p-1.5 text-sm", // أيقونة صغيرة
        "icon-lg": "p-3 text-lg", // أيقونة كبيرة
        "icon-xl": "p-4 text-xl", // أيقونة كبيرة جداً
      },
      fullWidth: {
        true: "w-full",
      },
      iconVariant: {
        default: "", // لا توجد أنماط إضافية للأيقونة
        ghost: "bg-transparent hover:bg-gray-100", // أيقونة شفافة
        outline: "border border-gray-300 hover:border-gray-400", // أيقونة بإطار
        filled: "bg-gray-100 hover:bg-gray-200", // أيقونة بخلفية
      },
    },
    compoundVariants: [
      // تركيبات خاصة للأزرار التي تحتوي على أيقونات فقط
      {
        size: "icon",
        className: "min-w-[40px] min-h-[40px]",
      },
      {
        size: "icon-sm",
        className: "min-w-[32px] min-h-[32px]",
      },
      {
        size: "icon-lg",
        className: "min-w-[48px] min-h-[48px]",
      },
      {
        size: "icon-xl",
        className: "min-w-[56px] min-h-[56px]",
      },
      // تركيبات للأيقونات مع الأنماط المختلفة
      {
        iconVariant: "ghost",
        className: "text-gray-600 hover:text-gray-800",
      },
      {
        iconVariant: "outline",
        className: "text-gray-700 hover:text-gray-900",
      },
      {
        iconVariant: "filled",
        className: "text-gray-700 hover:text-gray-900",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// أنواع الأحجام المخصصة للأيقونات
type IconSize = "sm" | "md" | "lg" | "xl";

// دالة مساعدة للحصول على حجم الأيقونة المناسب
const getIconSizeClass = (size?: IconSize | string) => {
  switch (size) {
    case "sm":
      return "h-4 w-4";
    case "md":
      return "h-5 w-5";
    case "lg":
      return "h-6 w-6";
    case "xl":
      return "h-7 w-7";
    default:
      return "h-5 w-5";
  }
};

interface ButtonProps
  extends HTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
  isloading?: boolean;
  type?: "submit" | "reset" | "button";
  icon?: ReactNode; // أيقونة اختيارية
  iconPosition?: "left" | "right"; // موضع الأيقونة
  iconSize?: IconSize; // حجم الأيقونة
}

const Button = ({
  type,
  variant,
  size,
  fullWidth,
  iconVariant,
  className,
  children,
  isloading,
  icon,
  iconPosition = "left",
  iconSize = "md",
  ...props
}: ButtonProps) => {
  const iconClass = getIconSizeClass(iconSize);
  
  // إذا كان الزر يحتوي على أيقونة فقط بدون نص
  const isIconOnly = !children && icon;
  
  // إذا كان الزر أيقونة فقط، نستخدم حجم الأيقونة المناسب
  const finalSize = isIconOnly ? 
    (size?.includes("icon") ? size : "icon") : 
    size;

  return (
    <button
      type={type}
      disabled={isloading}
      className={cn(
        buttonVariants({ 
          variant, 
          size: finalSize as any, 
          fullWidth, 
          iconVariant,
          className 
        })
      )}
      {...props}
    >
      {isloading && (
        <svg
          className={cn("animate-spin text-white mr-2", iconClass)}
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
      
      {/* عرض الأيقونة قبل النص إذا كانت على اليسار */}
      {!isloading && icon && iconPosition === "left" && (
        <span className={cn("shrink-0", children ? "mr-2" : "")}>
          {typeof icon === "string" ? (
            <span className={iconClass}>{icon}</span>
          ) : (
            <div className={iconClass}>{icon}</div>
          )}
        </span>
      )}
      
      {/* النص */}
      {children}
      
      {/* عرض الأيقونة بعد النص إذا كانت على اليمين */}
      {!isloading && icon && iconPosition === "right" && (
        <span className={cn("shrink-0", children ? "ml-2" : "")}>
          {typeof icon === "string" ? (
            <span className={iconClass}>{icon}</span>
          ) : (
            <div className={iconClass}>{icon}</div>
          )}
        </span>
      )}
    </button>
  );
};

export default Button;
export { buttonVariants };
export type { ButtonProps, IconSize };
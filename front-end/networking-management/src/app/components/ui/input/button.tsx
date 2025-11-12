import React, { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "success" | "danger" | "warning" | "gray";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      icon,
      iconPosition = "left",
      fullWidth = false,
      loading = false,
      className = "",
      children,
      disabled,
      ...props
    },
    ref
  ) => {

    const variantClasses = {
      primary: "bg-sky-600 hover:bg-sky-700 text-white",
      secondary: "bg-gray-600 hover:bg-gray-700 text-white",
      success: "bg-green-600 hover:bg-green-700 text-white",
      danger: "bg-red-600 hover:bg-red-700 text-white",
      warning: "bg-yellow-600 hover:bg-yellow-700 text-white",
      gray: "bg-gray-500 hover:bg-gray-600 text-white",
    };


    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };

    const iconSizeClasses = {
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={`
          flex items-center justify-center gap-2
          rounded-lg font-medium
          transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className={`animate-spin ${iconSizeClasses[size]}`}
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
            {children}
          </>
        ) : (
          <>
            {icon && iconPosition === "left" && (
              <span className={iconSizeClasses[size]}>{icon}</span>
            )}
            {children}
            {icon && iconPosition === "right" && (
              <span className={iconSizeClasses[size]}>{icon}</span>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps, ButtonSize, ButtonVariant };


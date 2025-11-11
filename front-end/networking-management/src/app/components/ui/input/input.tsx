import * as React from "react"

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={`w-full h-11 px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 text-base shadow-sm
        focus:outline-none focus:ring-1 focus:ring-sky-300 focus:border-sky-300
        placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out
        ${className || ""}`}
      {...props}
    />
  )
})

Input.displayName = "Input"

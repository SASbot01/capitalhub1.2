import React from "react";

// Extendemos los atributos para que puedan ser de INPUT o de SELECT
type InputProps = React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement> & {
  label?: string;
  type?: string;
  children?: React.ReactNode;
};

export default function Input({
  label,
  type = "text",
  className = "",
  children,
  ...rest
}: InputProps) {

  const isSelect = type === "select";

  const field = isSelect ? (
    <select
      className={`w-full border-none outline-none bg-transparent text-sm text-offwhite placeholder:text-muted ${className}`}
      {...(rest as React.SelectHTMLAttributes<HTMLSelectElement>)}
    >
      {children}
    </select>
  ) : (
    <input
      type={type}
      className={`w-full border-none outline-none bg-transparent text-sm text-offwhite placeholder:text-muted ${className}`}
      {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
    />
  );

  return (
    <label className="block text-sm font-medium text-offwhite">
      {label && <span className="mb-1 inline-block">{label}</span>}
      <div
        className={`
          mt-1
          flex items-center
          rounded-lg
          border border-graphite
          bg-carbon
          px-4
          py-3
          focus-within:border-accent
          focus-within:ring-1
          focus-within:ring-accent/30
        `}
      >
        {field}
      </div>
    </label>
  );
}

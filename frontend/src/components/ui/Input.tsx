import React from "react";

// Extendemos los atributos para que puedan ser de INPUT o de SELECT
type InputProps = React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement> & {
  label?: string;
  type?: string; // Hacemos 'type' explícito para la lógica
  children?: React.ReactNode; // Aceptamos hijos explícitamente (para <option>)
};

export default function Input({
  label,
  type = "text",
  className = "",
  children, // Desestructuramos children
  ...rest
}: InputProps) {
  
  const isSelect = type === "select";

  // 1. Renderizado condicional del campo interno
  const field = isSelect ? (
    // Si es tipo "select", renderizamos un <select> y le pasamos los children (<option>)
    <select
      className={`w-full border-none outline-none bg-transparent text-sm placeholder:text-neutral-400 ${className}`}
      // Pasamos el resto de props, asegurando que TypeScript no se queje
      {...(rest as React.SelectHTMLAttributes<HTMLSelectElement>)}
    >
      {children}
    </select>
  ) : (
    // Si no, renderizamos el <input> normal
    <input
      type={type}
      className={`w-full border-none outline-none bg-transparent text-sm placeholder:text-neutral-400 ${className}`}
      // Pasamos el resto de props
      {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
    />
  );

  return (
    <label className="block text-sm font-medium text-neutral-800">
      {label && <span className="mb-1 inline-block">{label}</span>}
      <div
        className={`
          mt-1
          flex items-center
          rounded-2xl
          border border-neutral-300
          bg-white
          px-4
          py-3
          focus-within:border-black
          focus-within:ring-1
          focus-within:ring-black/10
        `}
      >
        {/* 2. Insertamos el campo (input o select) aquí */}
        {field}
      </div>
    </label>
  );
}
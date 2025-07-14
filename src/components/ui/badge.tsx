import React from "react";

export function Badge({ children, className = "", ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold border bg-yellow-400/20 border-yellow-400 text-yellow-400 ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

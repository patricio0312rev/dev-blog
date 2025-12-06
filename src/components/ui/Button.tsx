import React from "react";
import { cn } from "@/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
}

interface ButtonLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href: string;
  external?: boolean;
  children: React.ReactNode;
}

const baseStyles =
  "inline-flex items-center justify-center font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950 disabled:pointer-events-none disabled:opacity-50";

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-sky-500 text-white shadow-sm hover:bg-sky-400 dark:bg-sky-600 dark:hover:bg-sky-500",
  secondary:
    "border border-zinc-300 bg-transparent text-zinc-800 hover:border-sky-400 hover:text-sky-500 dark:border-zinc-700 dark:text-zinc-100 dark:hover:border-sky-400 dark:hover:text-sky-400",
  ghost:
    "text-zinc-600 hover:text-sky-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-sky-400 dark:hover:bg-zinc-800",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "rounded-md px-3 py-1.5 text-xs",
  md: "rounded-lg px-4 py-2 text-sm",
  lg: "rounded-lg px-6 py-3 text-base",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export const ButtonLink: React.FC<ButtonLinkProps> = ({
  variant = "primary",
  size = "md",
  href,
  external = false,
  className,
  children,
  ...props
}) => {
  const externalProps = external
    ? { target: "_blank", rel: "noreferrer" }
    : {};

  return (
    <a
      href={href}
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...externalProps}
      {...props}
    >
      {children}
    </a>
  );
};

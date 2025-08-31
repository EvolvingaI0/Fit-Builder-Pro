
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

function Button({ children, className = '', variant = 'primary', isLoading = false, ...props }: ButtonProps) {
  const baseClasses = 'font-semibold py-2.5 px-5 rounded-xl transition-all duration-300 ease-in-out flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-4';

  const variantClasses = {
    primary: 'bg-primary text-primary-content hover:bg-primary-focus focus:ring-primary/30 shadow-sm hover:shadow-md',
    secondary: 'bg-secondary/50 text-secondary-content hover:bg-secondary/80 focus:ring-primary/20',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500/50'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;

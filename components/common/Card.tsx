
import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div className={`bg-surface border border-border rounded-xl shadow-sm p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;

import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', hoverable = false, ...props }) => {
  return (
    <div
      className={`bg-[#101318] border border-[#202630] rounded-md p-5 transition-all duration-200 ${
        hoverable ? 'hover:border-[#2C3545] hover:bg-[#141820]' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

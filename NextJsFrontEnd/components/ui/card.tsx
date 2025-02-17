// components/ui/card.tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return <div className={`border rounded-lg shadow-sm p-4 ${className}`}>{children}</div>;
};

// Updated CardContentProps to include className
interface CardContentProps {
  children: React.ReactNode;
  className?: string;  // Now accepts className
}

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => {
  return <div className={`space-y-4 ${className}`}>{children}</div>;
};

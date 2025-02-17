// components/ui/input.tsx
import React from 'react';

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => {
  return <input className="border p-2 rounded" {...props} />;
};

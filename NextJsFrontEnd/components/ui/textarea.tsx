// components/ui/textarea.tsx
export const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
    return <textarea className="border p-2 rounded" {...props} />;
  };
  
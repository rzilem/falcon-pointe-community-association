import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FormFieldProps {
  label: string;
  name: string;
  type?: "text" | "email" | "textarea";
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  error?: string;
}

const FormField = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  error,
}: FormFieldProps) => {
  const fieldId = `field-${name}`;
  const errorId = `${fieldId}-error`;
  const helpId = `${fieldId}-help`;

  return (
    <div>
      <label htmlFor={fieldId} className="block text-sm font-medium mb-1">
        {label}
        {required && <span aria-label="required" className="text-destructive ml-1">*</span>}
      </label>
      {type === "textarea" ? (
        <Textarea
          id={fieldId}
          name={name}
          placeholder={placeholder}
          className={`h-32 ${error ? 'border-red-500' : ''}`}
          value={value}
          onChange={onChange}
          required={required}
          aria-required={required}
          aria-describedby={`${helpId} ${error ? errorId : ''}`}
        />
      ) : (
        <Input
          id={fieldId}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          aria-required={required}
          className={error ? 'border-red-500' : ''}
          aria-describedby={`${helpId} ${error ? errorId : ''}`}
        />
      )}
      <div id={helpId} className="sr-only">
        {label} field. {required ? 'This field is required.' : 'This field is optional.'}
      </div>
      {error && (
        <div id={errorId} role="alert" aria-live="polite" className="text-sm text-red-600 mt-1">
          {error}
        </div>
      )}
    </div>
  );
};

export default FormField;
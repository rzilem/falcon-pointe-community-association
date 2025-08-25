
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
}

const FormField = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
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
          className="h-32"
          value={value}
          onChange={onChange}
          required={required}
          aria-required={required}
          aria-describedby={`${helpId} ${errorId}`}
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
          aria-describedby={`${helpId} ${errorId}`}
        />
      )}
      <div id={helpId} className="sr-only">
        {label} field. {required ? 'This field is required.' : 'This field is optional.'}
      </div>
      <div id={errorId} role="alert" aria-live="polite" className="sr-only">
        {/* Error messages would be populated here dynamically */}
      </div>
    </div>
  );
};

export default FormField;

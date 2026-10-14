import { createContext, useContext } from 'react';

export interface FormFieldContextValue {
  inputId: string;
  /** id of the helper/error text, for aria-describedby */
  helperTextId?: string;
}

export const FormFieldContext = createContext<FormFieldContextValue | null>(null);

/** Ids published by the nearest FormField; null outside one. */
export function useFormField(): FormFieldContextValue | null {
  return useContext(FormFieldContext);
}

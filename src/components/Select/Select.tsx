import MenuItem from '@mui/material/MenuItem';
import MuiSelect, { type SelectProps as MuiSelectProps } from '@mui/material/Select';
import { useFormField } from '../FormField/FormFieldContext.js';
import { Input } from '../Input/Input.js';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  disabled?: boolean;
}

export interface SelectProps<T extends string = string> extends Omit<
  MuiSelectProps<T>,
  'onChange' | 'children' | 'input' | 'variant' | 'multiple'
> {
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  /** Accessible name when the Select isn't inside a FormField. */
  'aria-label'?: string;
}

/**
 * Dropdown for picking one of a few options (e.g. a role), with the Input look. Inside a FormField
 * it's labelled by the field; otherwise give it an `aria-label`.
 */
export function Select<T extends string = string>({
  value,
  options,
  onChange,
  fullWidth = true,
  'aria-label': ariaLabel,
  SelectDisplayProps,
  ...props
}: SelectProps<T>) {
  const field = useFormField();
  return (
    <MuiSelect<T>
      value={value}
      labelId={field?.labelId}
      SelectDisplayProps={{
        ...(ariaLabel ? { 'aria-label': ariaLabel } : {}),
        ...SelectDisplayProps,
      }}
      onChange={(event) => onChange(event.target.value as T)}
      input={<Input />}
      fullWidth={fullWidth}
      {...props}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value} disabled={option.disabled}>
          {option.label}
        </MenuItem>
      ))}
    </MuiSelect>
  );
}

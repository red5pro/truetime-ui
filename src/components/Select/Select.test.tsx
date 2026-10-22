import { fireEvent, screen, within } from '@testing-library/react';
import { renderWithTheme } from '../../test/render.js';
import { FormField } from '../FormField/FormField.js';
import { Select } from './Select.js';

const roles = [
  { value: 'PARTICIPANT', label: 'Participant' },
  { value: 'PRODUCER', label: 'Producer' },
];

describe('Select', () => {
  it('shows the value and reports the option picked', () => {
    const onChange = vi.fn();
    renderWithTheme(
      <Select value="PARTICIPANT" options={roles} onChange={onChange} aria-label="Role" />,
    );
    const select = screen.getByRole('combobox', { name: 'Role' });
    expect(select).toHaveTextContent('Participant');
    fireEvent.mouseDown(select);
    fireEvent.click(within(screen.getByRole('listbox')).getByRole('option', { name: 'Producer' }));
    expect(onChange).toHaveBeenCalledWith('PRODUCER');
  });

  it('is labelled by its FormField', () => {
    renderWithTheme(
      <FormField label="Role">
        <Select value="PRODUCER" options={roles} onChange={() => {}} />
      </FormField>,
    );
    expect(screen.getByRole('combobox', { name: 'Role' })).toHaveTextContent('Producer');
  });
});

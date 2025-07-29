import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';

import { Select } from './Dropdown.styles';

export default function Dropdown({ value, options, label, onChange }) {
  const [selectedValue, setSelectedValue] = useState(value.key || options[0]?.key || '');

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    onChange(event.target.value);
  };

  return (
    <Select variant="standard" value={selectedValue} onChange={handleChange} label={label}>
      {options.map((option) => (
        <MenuItem key={option.key} value={option.key}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
}

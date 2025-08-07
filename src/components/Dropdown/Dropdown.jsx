import MenuItem from '@mui/material/MenuItem';

import { Select } from './Dropdown.styles';

export default function Dropdown({ value, options, label, onChange, width }) {
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <Select width={width} variant="standard" value={value} onChange={handleChange} label={label}>
      {options.map((option) => (
        <MenuItem key={option.key} value={option.key}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  );
}

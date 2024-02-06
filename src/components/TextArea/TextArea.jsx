import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';


export default function TextArea({text, handleBlur, rows }) {

  const [currentText, setCurrentText] = useState('');

  useEffect(() => {
    setCurrentText(text);
  }, [text]);

  const handleChange = (e) => {
    setCurrentText(e.target.value);
  }
  

  return (
    <TextField
    inputProps={{
      style: {
        padding: "0px"
      }
   }}
      fullWidth
      maxRows={rows}
      placeholder="..."
      value={currentText}
      onBlur={handleBlur}
      onChange={handleChange}
      multiline
    />
  );
}
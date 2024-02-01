import TextField from '@mui/material/TextField';


export default function TextArea({text, handleChange, rows }) {

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
      value={text}
      onChange={handleChange}
      multiline
    />
  );
}
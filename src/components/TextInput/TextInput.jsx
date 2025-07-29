import { Label, TextField, Wrapper } from './TextInput.styles';

function TextInput({ label, onChange, rows, onBlur, value }) {
  return (
    <Wrapper>
      <Label fontWeight="medium">{label}:</Label>
      <TextField multiline rows={rows} onChange={onChange} onBlur={onBlur} value={value} />
    </Wrapper>
  );
}
export default TextInput;

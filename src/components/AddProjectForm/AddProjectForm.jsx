import { Autocomplete, FormControl, MenuItem, TextField } from '@mui/material';

function AddProjectForm({
  onProjectChange,
  onInputChange,
  selectedProject,
  inputValue,
  linkValue,
  projects,
  newProjectType,
  isAddingNewProject,
  handleSetNewProjectType,
  handleSetIsAddingNewProject,
  handleSetLinkValue,
}) {
  const extendedOptions = [
    ...projects,
    ...(inputValue && !projects.find((p) => p.label === inputValue)
      ? [{ label: `➕ Add "${inputValue}"`, isNew: true }]
      : []),
  ];

  return (
    <FormControl sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Autocomplete
        freeSolo
        options={extendedOptions}
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.label)}
        value={selectedProject}
        inputValue={inputValue}
        onChange={(event, newValue) => {
          if (newValue?.isNew) {
            handleSetIsAddingNewProject(true);
            onProjectChange({ label: inputValue });
          } else {
            handleSetIsAddingNewProject(false);
            onProjectChange(newValue);
          }
        }}
        onInputChange={(event, newInputValue) => {
          onInputChange(newInputValue);
        }}
        renderInput={(params) => <TextField {...params} label="Select or Add Project" />}
      />

      {isAddingNewProject && (
        <>
          <TextField
            fullWidth
            required
            label="link"
            value={linkValue}
            onChange={(e) => handleSetLinkValue(e.target.value)}
          />
          <TextField
            select
            label="Project Type"
            value={newProjectType}
            onChange={(e) => handleSetNewProjectType(e.target.value)}
          >
            <MenuItem value="JS">JS</MenuItem>
            <MenuItem value="HTML">HTML</MenuItem>
            <MenuItem value="CSS">CSS</MenuItem>
            <MenuItem value="Multi">Multi</MenuItem>
            <MenuItem value="Config">Config</MenuItem>
          </TextField>
        </>
      )}
    </FormControl>
  );
}

export default AddProjectForm;

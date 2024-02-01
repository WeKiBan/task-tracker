import { useState } from 'react';
import { TextField, IconButton, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchBar = ({ searchValue, setSearchValue }) => {
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearchIconClick = () => {
    setSearchOpen(!searchOpen);
  };

  return (
    <Box boxShadow={1} sx={{ position: 'relative', display: 'flex', alignItems: 'center', border: 'solid 1px lightGrey', width: searchOpen ? '300px' : '50px', borderRadius: '50px 50px 50px 50px', transition: 'width ease-in-out 500ms' }}>
      <IconButton onClick={handleSearchIconClick} sx={{ position: 'absolute', right: '5px', zIndex: 10 }}>
        <SearchIcon />
      </IconButton>
      <TextField
        sx={{
          marginLeft: '10px',
          opacity: searchOpen ? '1' : '0',
          border: 0,
          transition: 'opacity ease-in-out 500ms',
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none', // Remove the outline border
          },
        }}
        size='small'
        value={searchValue}
        onChange={setSearchValue}
      />
    </Box>
  );
};

export default SearchBar;

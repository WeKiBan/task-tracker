import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
  SearchIcon,
} from "./SearchBar.styles";
import { useState } from "react";

function SearchBar({ placeholder, onSearch, fontSize, iconSize }) {
  const [search, setSearch] = useState("");
  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
    onSearch(e.target.value);
  };
  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon iconSize={iconSize} />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder={placeholder}
        inputProps={{ "aria-label": placeholder }}
        value={search}
        onChange={handleChangeSearch}
        fontSize={fontSize}
      />
    </Search>
  );
}
export default SearchBar;

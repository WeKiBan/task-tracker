import { Children } from 'react';

import EmptyListItem from '../EmptyListItem/EmptyListItem';
import SearchBar from '../SearchBar/SearchBar';
import { AddIcon, Button, ItemContainer, SearchWrapper, Wrapper } from './TaskListContainer.styles';

function TaskListContainer({ children, onClickAdd, emptyElementHeight, onSearch }) {
  return (
    <Wrapper>
      <SearchWrapper>
        <SearchBar
          placeholder="Search Tasks..."
          onSearch={onSearch}
          fontSize="2rem"
          iconSize="2.4rem"
        />
        <Button onClick={onClickAdd} variant="contained">
          <AddIcon />
        </Button>
      </SearchWrapper>
      <ItemContainer>
        {Children.count(children) > 0 ? (
          children
        ) : (
          <EmptyListItem height={emptyElementHeight} onClickAdd={onClickAdd} iconSize="2.4rem" />
        )}
      </ItemContainer>
    </Wrapper>
  );
}
export default TaskListContainer;

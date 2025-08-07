import { Children } from 'react';

import EmptyListItem from '../EmptyListItem/EmptyListItem';
import SearchBar from '../SearchBar/SearchBar';
import {
  AddIcon,
  Button,
  EmptySearchText,
  ItemContainer,
  NoMatchingSearchResults,
  SearchIcon,
  SearchWrapper,
  Wrapper,
} from './TaskListContainer.styles';

function TaskListContainer({ children, onClickAdd, emptyElementHeight, onSearch, query }) {
  const hasChildren = Children.count(children) > 0;
  const hasQuery = !!query.length;
  return (
    <Wrapper>
      <SearchWrapper>
        <SearchBar
          placeholder="Search Tasks..."
          onSearch={onSearch}
          fontSize="1.6rem"
          iconSize="2.4rem"
        />
        <Button onClick={onClickAdd} variant="contained">
          <AddIcon />
        </Button>
      </SearchWrapper>
      <ItemContainer>
        {hasChildren && children}
        {!hasChildren && hasQuery && (
          <NoMatchingSearchResults>
            <SearchIcon iconSize="6rem" />
            <EmptySearchText>
              <span>No tasks found.</span>
              <span>Try adjusting your search or filters. No luck this time.</span>
            </EmptySearchText>
          </NoMatchingSearchResults>
        )}
        {!hasChildren && !hasQuery && (
          <EmptyListItem height={emptyElementHeight} onClickAdd={onClickAdd} iconSize="2.4rem" />
        )}
      </ItemContainer>
    </Wrapper>
  );
}
export default TaskListContainer;

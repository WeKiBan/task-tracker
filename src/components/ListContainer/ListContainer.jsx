import { Children } from 'react';

import EmptyListItem from '../EmptyListItem/EmptyListItem';
import {
  AddIcon,
  IconButton,
  ItemContainer,
  Label,
  LabelWrapper,
  Wrapper,
} from './ListContainer.styles';

function ListContainer({ children, label, onClickAdd }) {
  return (
    <Wrapper>
      <LabelWrapper>
        <Label>{label}</Label>
        <IconButton onClick={onClickAdd}>
          <AddIcon />
        </IconButton>
      </LabelWrapper>
      <ItemContainer>
        {Children.count(children) > 0 ? (
          children
        ) : (
          <EmptyListItem onClickAdd={onClickAdd} iconSize="2.4rem" />
        )}
      </ItemContainer>
    </Wrapper>
  );
}
export default ListContainer;

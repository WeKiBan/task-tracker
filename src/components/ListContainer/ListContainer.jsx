import {
  Wrapper,
  ItemContainer,
  Label,
  LabelWrapper,
  AddIcon,
  IconButton,
} from "./ListContainer.styles";
import EmptyListItem from "../EmptyListItem/EmptyListItem";
import { Children } from "react";

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

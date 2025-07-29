import { AddIcon, Button } from './EmptyListItem.styles';

function EmptyListItem({ onClickAdd, height, iconSize }) {
  return (
    <Button
      height={height}
      onClick={(e) => {
        e.stopPropagation();
        onClickAdd();
      }}
    >
      <AddIcon iconSize={iconSize} />
    </Button>
  );
}

export default EmptyListItem;

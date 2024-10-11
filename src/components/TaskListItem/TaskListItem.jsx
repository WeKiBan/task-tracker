import {
  Wrapper,
  Description,
  Title,
  ButtonWrapper,
  TextWrapper,
  Button,
} from "./TaskListItem.styles";
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";

const TaskListItem = ({
  title,
  description,
  status,
  onSelectTask,
  isSelected,
  onClickArrowUp,
  onClickArrowDown,
}) => {
  return (
    <Wrapper onClick={onSelectTask} status={status} isSelected={isSelected}>
      <TextWrapper>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </TextWrapper>
      <ButtonWrapper>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onClickArrowUp();
          }}
        >
          <KeyboardArrowUp sx={{ height: "24px", width: "24px" }} />
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onClickArrowDown();
          }}
        >
          <KeyboardArrowDown sx={{ height: "24px", width: "24px" }} />
        </Button>
      </ButtonWrapper>
    </Wrapper>
  );
};

export default TaskListItem;

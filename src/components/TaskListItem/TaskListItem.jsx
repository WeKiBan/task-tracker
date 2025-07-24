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
  task,
  selectedTaskId,
  onClickArrowUp,
  onClickArrowDown,
  onSelectTask,
}) => {
  const { title, description, status, id } = task;
  return (
    <Wrapper
      onClick={() => onSelectTask(task)}
      status={status}
      isSelected={id === selectedTaskId}
    >
      <TextWrapper>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </TextWrapper>
      <ButtonWrapper>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onClickArrowUp(id);
          }}
        >
          <KeyboardArrowUp sx={{ height: "24px", width: "24px" }} />
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onClickArrowDown(id);
          }}
        >
          <KeyboardArrowDown sx={{ height: "24px", width: "24px" }} />
        </Button>
      </ButtonWrapper>
    </Wrapper>
  );
};

export default TaskListItem;

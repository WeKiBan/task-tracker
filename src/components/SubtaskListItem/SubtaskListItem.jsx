import {
  Wrapper,
  Title,
  ButtonWrapper,
  TextWrapper,
  Button,
} from "./SubtaskListItem.styles";
import { Delete, Link } from "@mui/icons-material";

const SubtaskListItem = ({
  title,
  color,
  onSelectTask,
  onClickDelete,
  onClickLink,
}) => {
  return (
    <Wrapper onClick={onSelectTask} color={color}>
      <TextWrapper>
        <Title>{title}</Title>
      </TextWrapper>
      <ButtonWrapper>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onClickLink();
          }}
        >
          <Link sx={{ height: "16px", width: "16px" }} />
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onClickDelete();
          }}
        >
          <Delete sx={{ height: "16px", width: "16px" }} />
        </Button>
      </ButtonWrapper>
    </Wrapper>
  );
};

export default SubtaskListItem;

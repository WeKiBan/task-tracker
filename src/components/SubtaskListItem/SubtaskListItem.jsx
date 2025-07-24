import {
  Wrapper,
  Title,
  ButtonWrapper,
  TextWrapper,
  Button,
} from "./SubtaskListItem.styles";
import { Delete, Link } from "@mui/icons-material";

const SubtaskListItem = ({ subtask, onClickDelete, onSelectTask }) => {
  const { status, id, title, link } = subtask;
  const onClickLink = () => {
    if (link) {
      window.open(link, "_blank", "noopener,noreferrer");
    }
  };
  return (
    <Wrapper onClick={() => onSelectTask(id)} status={status}>
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
            onClickDelete(id);
          }}
        >
          <Delete sx={{ height: "16px", width: "16px" }} />
        </Button>
      </ButtonWrapper>
    </Wrapper>
  );
};

export default SubtaskListItem;

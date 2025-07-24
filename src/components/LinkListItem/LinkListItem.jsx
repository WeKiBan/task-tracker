import {
  Wrapper,
  Title,
  ButtonWrapper,
  TextWrapper,
  Button,
} from "./LinkListItem.styles";
import { Delete, Link } from "@mui/icons-material";

const LinkListItem = ({ linkData, onClickDelete }) => {
  const { id, label, link } = linkData;
  const onClickLink = () => {
    if (link) {
      window.open(link, "_blank", "noopener,noreferrer");
    }
  };
  return (
    <Wrapper
      onClick={(e) => {
        e.stopPropagation();
        onClickLink();
      }}
    >
      <TextWrapper>
        <Title>{label}</Title>
      </TextWrapper>
      <ButtonWrapper>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onClickDelete(linkData.id);
          }}
        >
          <Delete sx={{ height: "16px", width: "16px" }} />
        </Button>
      </ButtonWrapper>
    </Wrapper>
  );
};

export default LinkListItem;

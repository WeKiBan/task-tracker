import {
  Wrapper,
  Title,
  ButtonWrapper,
  TextWrapper,
  Button,
} from "./ProjectListItem.styles";
import { Delete, Link } from "@mui/icons-material";

const ProjectListItem = ({ title, type, onClickDelete, project }) => {
  const onClickLink = () => {
    if (project.link) {
      window.open(project.link, "_blank");
    }
  };
  return (
    <Wrapper onClick={onClickLink} type={type}>
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
            onClickDelete(project.id);
          }}
        >
          <Delete sx={{ height: "16px", width: "16px" }} />
        </Button>
      </ButtonWrapper>
    </Wrapper>
  );
};

export default ProjectListItem;

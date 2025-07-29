import { Delete, Link as LinkIcon } from '@mui/icons-material';

import { Button, ButtonWrapper, TextWrapper, Title, Wrapper } from './ProjectListItem.styles';

function ProjectListItem({ title, type, onClickDelete, project }) {
  const onClickLink = () => {
    if (project.link) {
      window.open(project.link, '_blank');
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
          <LinkIcon sx={{ height: '16px', width: '16px' }} />
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onClickDelete(project.id);
          }}
        >
          <Delete sx={{ height: '16px', width: '16px' }} />
        </Button>
      </ButtonWrapper>
    </Wrapper>
  );
}

export default ProjectListItem;

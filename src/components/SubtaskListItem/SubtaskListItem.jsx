import { Delete, Link as LinkIcon } from '@mui/icons-material';

import { Button, ButtonWrapper, TextWrapper, Title, Wrapper } from './SubtaskListItem.styles';

function SubtaskListItem({ subtask, onClickDelete, onSelectTask }) {
  const { status, id, title, link } = subtask;
  const onClickLink = () => {
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
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
          <LinkIcon sx={{ height: '16px', width: '16px' }} />
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onClickDelete(id);
          }}
        >
          <Delete sx={{ height: '16px', width: '16px' }} />
        </Button>
      </ButtonWrapper>
    </Wrapper>
  );
}

export default SubtaskListItem;

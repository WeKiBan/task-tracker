import { Delete } from '@mui/icons-material';

import { Button, ButtonWrapper, TextWrapper, Title, Wrapper } from './LinkListItem.styles';

function LinkListItem({ linkData, onClickDelete }) {
  const { title, link } = linkData;
  const onClickLink = () => {
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
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
        <Title>{title}</Title>
      </TextWrapper>
      <ButtonWrapper>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            onClickDelete(linkData.id);
          }}
        >
          <Delete sx={{ height: '16px', width: '16px' }} />
        </Button>
      </ButtonWrapper>
    </Wrapper>
  );
}

export default LinkListItem;

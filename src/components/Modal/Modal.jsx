import { Modal, Typography, Button, Box } from '@mui/material';

const ModalComponent = ({ open, handleClose, title, content, buttons }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
        <Typography variant='h6' component='h2' gutterBottom>
          {title}
        </Typography>
        <Typography variant='body1' component='div'>
          {content}
        </Typography>
        <Box sx={{ display: 'flex', gap: '20px', justifyContent: "space-around" }}>
          {buttons &&
            buttons.map((button, index) => (
              <Button key={index} onClick={button.function} sx={{ mt: 2, mr: 2 }}>
                {button.label}
              </Button>
            ))}
        </Box>
      </Box>
    </Modal>
  );
};

export default ModalComponent;

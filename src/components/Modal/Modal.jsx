import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

function Modal({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  showActions = false,
}) {
  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>{children}</DialogContent>

      {showActions && (
        <DialogActions>
          <Button size="large" onClick={onClose}>
            {cancelText}
          </Button>
          <Button size="large" variant="contained" onClick={onConfirm}>
            {confirmText}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
}

export default Modal;

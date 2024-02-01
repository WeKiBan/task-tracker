import Modal from '../Modal/Modal'
import EmailOutput from "../EmailOutput/EmailOutput"

const GenerateEmailModal = ({ open, handleClose }) => {

  const handleCancel = () => {
    handleClose();
  };

  const  handleCopyText = (textareaRef) => {
  // Check if the textarea reference is not null
  if (textareaRef.current) {
    // Select the text in the textarea
    textareaRef.current.select();

    // Execute the copy command
    document.execCommand('copy');

    // Deselect the text to avoid unwanted visual effects
    window.getSelection().removeAllRanges();
  }


  };


  return (
    <Modal
      open={open}
      handleClose={handleClose}
      title="Email"
      content={
        <EmailOutput />
      }
      buttons={[
        {
          label: 'Cancel',
          function: handleCancel,
          color: 'default',
          variant: 'outlined',
        },
        {
          label: 'Copy',
          function: handleCopyText,
          color: 'primary',
          variant: 'contained',
        },
      ]}
    />
  );
};

export default GenerateEmailModal;
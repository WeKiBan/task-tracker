import Modal from '../Modal/Modal';
import EmailOutput from '../EmailOutput/EmailOutput';
import { useRef } from 'react';

const GenerateEmailModal = ({ open, handleClose }) => {
  const handleCancel = () => {
    handleClose();
  };

  const textFieldRef = useRef(null);

  const handleCopyText = () => {
    console.log('copy');
    // Check if the textarea reference is not null
    if (textFieldRef.current) {
      const textArea = textFieldRef.current.querySelectorAll('textarea')[0];

      // Select the text in the textarea
      textArea.select();
      // // Execute the copy command
      document.execCommand('copy');

      // // Deselect the text to avoid unwanted visual effects
      window.getSelection().removeAllRanges();
    }
  };

  return (
    <Modal
      open={open}
      handleClose={handleClose}
      title='Generated Daily Email...'
      width='60vw'
      content={<EmailOutput textFieldRef={textFieldRef} />}
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

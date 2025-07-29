import AddLinkForm from '../AddLinkForm/AddLinkForm';
import Modal from '../Modal/Modal';
import { useAddLinkModal } from './useAddLinkModal';

function AddLinkModal({ isOpen, onClose, task }) {
  const { link, title, setLink, setTitle, handleConfirm, handleClose } = useAddLinkModal(
    task,
    onClose,
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={handleConfirm}
      title="Add Link"
      showActions
    >
      <AddLinkForm link={link} setLink={setLink} title={title} setTitle={setTitle} />
    </Modal>
  );
}

export default AddLinkModal;

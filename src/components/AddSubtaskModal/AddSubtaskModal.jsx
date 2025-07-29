import AddSubtaskForm from '../AddSubTaskForm/AddSubtaskForm';
import Modal from '../Modal/Modal';
import { useAddSubtaskModal } from './useAddSubtaskModal';

function AddSubtaskModal({ isOpen, task, onClose }) {
  const { title, link, setTitle, setLink, handleConfirm, handleClose } = useAddSubtaskModal(
    task,
    onClose,
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={handleConfirm}
      title="Add Subtask"
      showActions
    >
      <AddSubtaskForm setTitle={setTitle} title={title} setLink={setLink} link={link} />
    </Modal>
  );
}

export default AddSubtaskModal;

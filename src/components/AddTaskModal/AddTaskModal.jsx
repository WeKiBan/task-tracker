import AddTaskForm from '../AddTaskForm/AddTaskForm';
import Modal from '../Modal/Modal';
import { useAddTaskModal } from './useAddTaskModal';

function AddTaskModal({ isOpen, onClose, onSelectTask }) {
  const { link, title, setLink, setTitle, handleConfirm, handleClose } = useAddTaskModal(
    onClose,
    onSelectTask,
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={handleConfirm}
      title="Add Task"
      showActions
    >
      <AddTaskForm link={link} setLink={setLink} title={title} setTitle={setTitle} />
    </Modal>
  );
}

export default AddTaskModal;

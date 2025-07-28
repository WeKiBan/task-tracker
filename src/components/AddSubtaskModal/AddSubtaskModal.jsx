import { useState } from "react";
import Modal from "../Modal/Modal";
import AddSubtaskForm from "../AddSubTaskForm/AddSubtaskForm";

const AddSubtaskModal = ({ isOpen, onClose, handleAddNewSubtask }) => {
  const [subtaskData, setSubtaskData] = useState({
    title: "",
    link: "",
  });

  const handleConfirm = () => {
    handleAddNewSubtask(subtaskData.title, subtaskData.link);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Add Subtask"
      showActions
    >
      <AddSubtaskForm onChange={setSubtaskData} subtaskData={subtaskData} />
    </Modal>
  );
};

export default AddSubtaskModal;

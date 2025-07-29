import { useState } from 'react';

import AddSubtaskForm from '../AddSubTaskForm/AddSubtaskForm';
import Modal from './Modal';

export default {
  title: 'Modal Component',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
};

export function ModalComponent({ title }) {
  const [openModal, setOpenModal] = useState(false);

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  return (
    <div style={{ width: '200px', height: '280px' }}>
      <button type="button" onClick={handleOpen}>
        Open Modal
      </button>
      <Modal isOpen={openModal} onClose={handleClose} title={title}>
        <AddSubtaskForm />
      </Modal>
    </div>
  );
}

ModalComponent.args = {
  title: 'Add New Subtask',
};

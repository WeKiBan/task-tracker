import { fn } from "@storybook/test";
import Modal from "./Modal";
import AddSubtaskForm from "../AddSubTaskForm/AddSubtaskForm";
import { useState } from "react";

export default {
  title: "Modal Component",
  component: Modal,
  parameters: {
    layout: "centered",
  },
};

export const ModalComponent = (args) => {
  const [openModal, setOpenModal] = useState(false);

  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);

  return (
    <div style={{ width: "200px", height: "280px" }}>
      <button onClick={handleOpen}>Open Modal</button>
      <Modal isOpen={openModal} onClose={handleClose} title={args.title}>
        <AddSubtaskForm />
      </Modal>
    </div>
  );
};

ModalComponent.args = {
  title: "Add New Subtask",
};

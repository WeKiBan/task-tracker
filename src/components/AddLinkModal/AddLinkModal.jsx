import { useState } from "react";
import Modal from "../Modal/Modal";
import AddLinkForm from "../AddLinkForm/AddLinkForm";

const AddLinkModal = ({ isOpen, onClose, handleAddNewLink }) => {
  const [linkData, setLinkData] = useState({
    title: "",
    link: "",
  });

  const handleConfirm = () => {
    handleAddNewLink(linkData.title, linkData.link);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Add Link"
      showActions
    >
      <AddLinkForm onChange={setLinkData} linkData={linkData} />
    </Modal>
  );
};

export default AddLinkModal;

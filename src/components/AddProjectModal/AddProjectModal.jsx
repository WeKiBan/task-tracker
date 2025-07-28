import { useState } from "react";
import Modal from "../Modal/Modal";
import AddProjectForm from "../AddProjectForm/AddProjectForm";

import { useAddProjectModal } from "./useAddProjectModal";

const AddProjectModal = ({ isOpen, onClose, task }) => {
  const {
    projects,
    autoCompleteValue,
    selectedProject,
    isAddingNewProject,
    newProjectType,
    linkValue,
    handleInputChange,
    handleProjectChange,
    handleAddNewProject,
    handleSetNewProjectType,
    handleSetIsAddingNewProject,
    handleSetLinkValue,
  } = useAddProjectModal(task);

  const handleConfirm = () => {
    handleAddNewProject();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Add Project"
      showActions
    >
      <AddProjectForm
        onProjectChange={handleProjectChange}
        onInputChange={handleInputChange}
        selectedProject={selectedProject}
        inputValue={autoCompleteValue}
        projects={projects}
        newProjectType={newProjectType}
        isAddingNewProject={isAddingNewProject}
        handleSetNewProjectType={handleSetNewProjectType}
        handleSetIsAddingNewProject={handleSetIsAddingNewProject}
        handleSetLinkValue={handleSetLinkValue}
        linkValue={linkValue}
      />
    </Modal>
  );
};

export default AddProjectModal;

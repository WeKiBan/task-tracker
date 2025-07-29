import AddProjectForm from '../AddProjectForm/AddProjectForm';
import Modal from '../Modal/Modal';
import { useAddProjectModal } from './useAddProjectModal';

function AddProjectModal({ isOpen, onClose, task }) {
  const {
    projects,
    autoCompleteValue,
    selectedProject,
    isAddingNewProject,
    newProjectType,
    linkValue,
    handleInputChange,
    handleProjectChange,
    handleSetNewProjectType,
    handleSetIsAddingNewProject,
    handleSetLinkValue,
    handleClose,
    handleConfirm,
  } = useAddProjectModal(task, onClose);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
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
}

export default AddProjectModal;

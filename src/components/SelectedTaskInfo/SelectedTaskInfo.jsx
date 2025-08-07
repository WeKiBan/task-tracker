import AddLinkModal from '../AddLinkModal/AddLinkModal';
import AddProjectModal from '../AddProjectModal/AddProjectModal';
import AddSubtaskModal from '../AddSubtaskModal/AddSubtaskModal';
import LinkListItem from '../LinkListItem/LinkListItem';
import ListContainer from '../ListContainer/ListContainer';
import Modal from '../Modal/Modal';
import ProjectListItem from '../ProjectListItem/ProjectListItem';
import SelectedTaskHeader from '../SelectedTaskHeader/SelectedTaskHeader';
import SubtaskListItem from '../SubtaskListItem/SubtaskListItem';
import TextInput from '../TextInput/TextInput';
import { Column, Container, Wrapper } from './SelectedTaskInfo.styles';
import { useTaskForm } from './useTaskForm';

function SelectedTaskInfo({ task, resetSelectedTask }) {
  const {
    description,
    notes,
    emailNote,
    addSubtaskModalOpen,
    addLinkModalOpen,
    addProjectModalOpen,
    confirmDeleteModalOpen,
    handleBlur,
    handleDescriptionChange,
    handleNotesChange,
    handleEmailNoteChange,
    openSubtaskModal,
    closeSubtaskModal,
    closeLinkModal,
    openLinkModal,
    closeProjectModal,
    openProjectModal,
    handleOpenConfirmDeleteModal,
    handleConfirmDelete,
    handleCloseConfirmDeleteModal,
  } = useTaskForm(task);

  return (
    <>
      <Wrapper sx={{ height: '100%', minHeight: 0 }}>
        <SelectedTaskHeader task={task} resetSelectedTask={resetSelectedTask} />
        <Container padding="10px 0" flexDirection="row" justifyContent="space-between">
          <Column flexamount={7}>
            <TextInput
              value={description}
              onChange={handleDescriptionChange}
              onBlur={() => handleBlur('description')}
              rows="3"
              label="Description"
            />
            <TextInput
              onBlur={() => handleBlur('notes')}
              onChange={handleNotesChange}
              value={notes}
              rows="10"
              label="Notes"
            />
            <Container flexDirection="row" justifyContent="space-between">
              <ListContainer onClickAdd={openSubtaskModal} label="Subtasks:">
                {task &&
                  task.subtasks &&
                  task.subtasks.map((subtask) => (
                    <SubtaskListItem
                      key={subtask.id}
                      subtask={subtask}
                      onClickDelete={() => handleOpenConfirmDeleteModal('subtask', subtask.id)}
                    />
                  ))}
              </ListContainer>
              <ListContainer onClickAdd={openLinkModal} label="Useful Links:">
                {task &&
                  task.links &&
                  task.links.map((link) => (
                    <LinkListItem
                      onClickDelete={() => handleOpenConfirmDeleteModal('link', link.id)}
                      key={link.id}
                      linkData={link}
                    />
                  ))}
              </ListContainer>
            </Container>
          </Column>
          <Column sx={{ minHeight: '0' }} flexamount={3}>
            <TextInput
              onBlur={() => handleBlur('emailNote')}
              onChange={handleEmailNoteChange}
              value={emailNote}
              rows="3"
              label="Email Note"
            />
            <ListContainer onClickAdd={openProjectModal} label="Projects:">
              {task &&
                task.projects &&
                task.projects.map((project) => (
                  <ProjectListItem
                    type={project.type}
                    title={project.label}
                    key={project.id}
                    project={project}
                    onClickDelete={() => handleOpenConfirmDeleteModal('project', project.id)}
                  />
                ))}
            </ListContainer>
          </Column>
        </Container>
      </Wrapper>
      <AddSubtaskModal isOpen={addSubtaskModalOpen} onClose={closeSubtaskModal} task={task} />
      <AddLinkModal isOpen={addLinkModalOpen} onClose={closeLinkModal} task={task} />
      <AddProjectModal isOpen={addProjectModalOpen} onClose={closeProjectModal} task={task} />
      {/* confirm delete modal */}
      <Modal
        isOpen={confirmDeleteModalOpen.isOpen}
        title={`Are you sure you want to delete this ${confirmDeleteModalOpen.type}?`}
        onClose={() => handleCloseConfirmDeleteModal(false)}
        onConfirm={() => handleConfirmDelete(confirmDeleteModalOpen.id)}
        showActions
      />
    </>
  );
}

export default SelectedTaskInfo;

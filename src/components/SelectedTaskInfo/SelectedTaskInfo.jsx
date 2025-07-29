import AddLinkModal from '../AddLinkModal/AddLinkModal';
import AddProjectModal from '../AddProjectModal/AddProjectModal';
import AddSubtaskModal from '../AddSubtaskModal/AddSubtaskModal';
import LinkListItem from '../LinkListItem/LinkListItem';
import ListContainer from '../ListContainer/ListContainer';
import ProjectListItem from '../ProjectListItem/ProjectListItem';
import SelectedTaskHeader from '../SelectedTaskHeader/SelectedTaskHeader';
import SubtaskListItem from '../SubtaskListItem/SubtaskListItem';
import TextInput from '../TextInput/TextInput';
import { Column, Container, Wrapper } from './SelectedTaskInfo.styles';
import { useTaskForm } from './useTaskForm';

function SelectedTaskInfo({ task }) {
  const {
    description,
    notes,
    emailNote,
    addSubtaskModalOpen,
    addLinkModalOpen,
    addProjectModalOpen,
    handleBlur,
    handleDescriptionChange,
    handleNotesChange,
    handleEmailNoteChange,
    openSubtaskModal,
    closeSubtaskModal,
    onDeleteLink,
    onDeleteProject,
    onDeleteSubtask,
    closeLinkModal,
    openLinkModal,
    closeProjectModal,
    openProjectModal,
  } = useTaskForm(task);

  return (
    <>
      <Wrapper sx={{ height: '100%', minHeight: 0 }}>
        <SelectedTaskHeader task={task} />
        <Container padding="10px" flexDirection="row" justifyContent="space-between">
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
                      onClickDelete={onDeleteSubtask}
                    />
                  ))}
              </ListContainer>
              <ListContainer onClickAdd={openLinkModal} label="Useful Links:">
                {task &&
                  task.links &&
                  task.links.map((link) => (
                    <LinkListItem onClickDelete={onDeleteLink} key={link.id} linkData={link} />
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
                    onClickDelete={onDeleteProject}
                  />
                ))}
            </ListContainer>
          </Column>
        </Container>
      </Wrapper>
      <AddSubtaskModal isOpen={addSubtaskModalOpen} onClose={closeSubtaskModal} task={task} />
      <AddLinkModal isOpen={addLinkModalOpen} onClose={closeLinkModal} task={task} />
      <AddProjectModal isOpen={addProjectModalOpen} onClose={closeProjectModal} task={task} />
    </>
  );
}

export default SelectedTaskInfo;

import { Wrapper, Container, Column } from "./SelectedTaskInfo.styles";
import SelectedTaskHeader from "../SelectedTaskHeader/SelectedTaskHeader";
import SubtaskListItem from "../SubtaskListItem/SubtaskListItem";
import LinkListItem from "../LinkListItem/LinkListItem";
import TextInput from "../TextInput/TextInput";
import ListContainer from "../ListContainer/ListContainer";
import ProjectListItem from "../ProjectListItem/ProjectListItem";
import { useTaskForm } from "./useTaskForm";

const SelectedTaskInfo = ({ task }) => {
  const {
    description,
    notes,
    emailNote,
    handleBlur,
    handleDescriptionChange,
    handleNotesChange,
    handleEmailNoteChange,
    onAddSubtask,
    onAddLink,
    onAddProject,
    onDeleteLink,
    onDeleteProject,
    onDeleteSubtask,
  } = useTaskForm(task);

  return (
    <Wrapper sx={{ height: "100%", minHeight: 0 }}>
      <SelectedTaskHeader task={task} />
      <Container
        padding="10px"
        flexDirection="row"
        justifyContent="space-between"
      >
        <Column flexAmount={7}>
          <TextInput
            value={description}
            onChange={handleDescriptionChange}
            onBlur={() => handleBlur("description")}
            rows="3"
            label="Description"
          />
          <TextInput
            onBlur={() => handleBlur("notes")}
            onChange={handleNotesChange}
            value={notes}
            rows="10"
            label="Notes"
          />
          <Container flexDirection="row" justifyContent="space-between">
            <ListContainer onClickAdd={onAddSubtask} label="Subtasks:">
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
            <ListContainer onClickAdd={onAddLink} label="Useful Links:">
              {task &&
                task.links &&
                task.links.map((link) => (
                  <LinkListItem
                    onClickDelete={onDeleteLink}
                    key={link.id}
                    linkData={link}
                  />
                ))}
            </ListContainer>
          </Container>
        </Column>
        <Column sx={{ minHeight: "0" }} flexAmount={3}>
          <TextInput
            onBlur={() => handleBlur("emailNote")}
            onChange={handleEmailNoteChange}
            value={emailNote}
            rows="3"
            label="Email Note"
          />
          <ListContainer onClickAdd={onAddProject} label="Projects:">
            {task &&
              task.projects &&
              task.projects.map((project) => (
                <ProjectListItem
                  color={project.color}
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
  );
};

export default SelectedTaskInfo;

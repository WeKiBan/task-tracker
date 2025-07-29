import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { updateTaskRequest } from '../../redux/features/tasks/tasksActions';

export const useTaskForm = (task) => {
  const [description, setDescription] = useState(task ? task.description : '');
  const [notes, setNotes] = useState(task ? task.notes : '');
  const [emailNote, setEmailNote] = useState(task ? task.emailNote : '');
  const [addSubtaskModalOpen, setAddSubtaskModalOpen] = useState(false);
  const [addLinkModalOpen, setAddLinkModalOpen] = useState(false);
  const [addProjectModalOpen, setAddProjectModalOpen] = useState(false);

  const dispatch = useDispatch();

  const openSubtaskModal = () => {
    setAddSubtaskModalOpen(true);
  };

  const closeSubtaskModal = () => {
    setAddSubtaskModalOpen(false);
  };

  const openLinkModal = () => {
    setAddLinkModalOpen(true);
  };

  const closeLinkModal = () => {
    setAddLinkModalOpen(false);
  };

  const openProjectModal = () => {
    setAddProjectModalOpen(true);
  };

  const closeProjectModal = () => {
    setAddProjectModalOpen(false);
  };

  const handleBlur = (input) => {
    switch (input) {
      case 'description':
        dispatch(updateTaskRequest({ ...task, description }));
        break;
      case 'notes':
        dispatch(updateTaskRequest({ ...task, notes }));
        break;
      case 'emailNote':
        dispatch(updateTaskRequest({ ...task, emailNote }));
        break;
      default:
        console.warn(`Unhandled input: ${input}`);
        break;
    }
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  const handleEmailNoteChange = (e) => {
    setEmailNote(e.target.value);
  };

  const onDeleteLink = (id) => {
    const updatedTask = {
      ...task,
      links: task.links.filter((link) => link.id !== id),
    };
    dispatch(updateTaskRequest(updatedTask));
    console.log(`Delete link with id: ${id}`);
  };

  const onDeleteProject = (id) => {
    const updatedTask = {
      ...task,
      projects: task.projects.filter((link) => link.id !== id),
    };
    dispatch(updateTaskRequest(updatedTask));
    console.log(`Delete link with id: ${id}`);
  };

  const onDeleteSubtask = (id) => {
    const updatedTask = {
      ...task,
      subtasks: task.subtasks.filter((subtask) => subtask.id !== id),
    };
    dispatch(updateTaskRequest(updatedTask));
    console.log(`Delete link with id: ${id}`);
  };

  useEffect(() => {
    setDescription(task?.description || '');
    setNotes(task?.notes || '');
    setEmailNote(task?.emailNote || '');
  }, [task?.id, task?.description, task?.notes, task?.emailNote]);

  return {
    description,
    notes,
    emailNote,
    addSubtaskModalOpen,
    addLinkModalOpen,
    addProjectModalOpen,
    openSubtaskModal,
    closeSubtaskModal,
    openLinkModal,
    closeLinkModal,
    openProjectModal,
    closeProjectModal,
    handleBlur,
    handleDescriptionChange,
    handleNotesChange,
    handleEmailNoteChange,
    onDeleteLink,
    onDeleteProject,
    onDeleteSubtask,
  };
};

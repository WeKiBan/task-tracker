import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { updateProjectsRequest } from '../../redux/features/projects/projectsActions';
import { updateTaskRequest } from '../../redux/features/tasks/tasksActions';

export const useAddProjectModal = (task, onClose) => {
  const dispatch = useDispatch();
  const [selectedProject, setSelectedProject] = useState(null);
  const projects = useSelector((state) => [...state.projects.projects]);
  const [autoCompleteValue, setAutoCompleteValue] = useState('');
  const [isAddingNewProject, setIsAddingNewProject] = useState(false);
  const [newProjectType, setNewProjectType] = useState('');
  const [linkValue, setLinkValue] = useState('');

  const handleProjectChange = (newValue) => {
    setSelectedProject(newValue);
  };

  const handleInputChange = (newInputValue) => {
    setAutoCompleteValue(newInputValue);
  };

  const handleAddNewProject = () => {
    if (isAddingNewProject) {
      const newProject = {
        label: autoCompleteValue,
        type: newProjectType,
        id: crypto.randomUUID(),
      };
      const updatedProjects = [...projects, newProject];
      const updatedTask = {
        ...task,
        projects: [...task.projects, newProject],
      };
      dispatch(updateProjectsRequest(updatedProjects));
      dispatch(updateTaskRequest(updatedTask));
    } else {
      const updatedTask = {
        ...task,
        projects: [...task.projects, selectedProject],
      };
      dispatch(updateTaskRequest(updatedTask));
      console.log(`New project added with Id: ${selectedProject.id}`);
    }
  };

  const handleDeleteProject = (id) => {
    const updatedTask = {
      ...task,
      projects: task.projects.filter((project) => project.id !== id),
    };
    dispatch(updateTaskRequest(updatedTask));
    console.log(`Deleted project with id: ${id}`);
  };

  const handleSetNewProjectType = (type) => {
    setNewProjectType(type);
  };

  const handleSetIsAddingNewProject = (value) => {
    setIsAddingNewProject(value);
  };

  const handleSetLinkValue = (link) => {
    setLinkValue(link);
  };

  const handleReset = () => {
    // timeout to ensure state is reset after modal close
    // this is a workaround to avoid state being reset immediately on close
    setTimeout(() => {
      setSelectedProject(null);
      setAutoCompleteValue('');
      setNewProjectType('');
      setIsAddingNewProject(false);
      setLinkValue('');
    }, 100);
  };

  const handleConfirm = () => {
    handleAddNewProject();
    onClose();
    handleReset();
  };

  const handleClose = () => {
    onClose();
    handleReset();
  };

  return {
    projects,
    autoCompleteValue,
    selectedProject,
    isAddingNewProject,
    newProjectType,
    linkValue,
    handleProjectChange,
    handleInputChange,
    handleDeleteProject,
    handleSetNewProjectType,
    handleSetIsAddingNewProject,
    handleSetLinkValue,
    handleClose,
    handleConfirm,
  };
};

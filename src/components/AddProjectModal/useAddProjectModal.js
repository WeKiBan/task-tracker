import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateTaskRequest } from "../../redux/features/tasks/tasksActions";
import { updateProjectsRequest } from "../../redux/features/projects/projectsActions";

export const useAddProjectModal = (task) => {
  const dispatch = useDispatch();
  const [selectedProject, setSelectedProject] = useState(null);
  const projects = useSelector((state) => [...state.projects.projects]);
  const [autoCompleteValue, setAutoCompleteValue] = useState("");
  const [isAddingNewProject, setIsAddingNewProject] = useState(false);
  const [newProjectType, setNewProjectType] = useState("");
  const [linkValue, setLinkValue] = useState("");

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
    }

    console.log(`New project added with Id: ${selectedProject.id}`);
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

  return {
    projects,
    autoCompleteValue,
    selectedProject,
    isAddingNewProject,
    newProjectType,
    linkValue,
    handleProjectChange,
    handleInputChange,
    handleAddNewProject,
    handleDeleteProject,
    handleSetNewProjectType,
    handleSetIsAddingNewProject,
    handleSetLinkValue,
  };
};

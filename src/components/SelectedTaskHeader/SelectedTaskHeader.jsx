import { Delete, Edit, Link as LinkIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useState } from 'react';

import { TICKET_STATUSES } from '../../config/constants';
import { useUpdateTask } from '../../hooks/useUpdateTask';
import AddTaskModal from '../AddTaskModal/AddTaskModal';
import Dropdown from '../Dropdown/Dropdown';
import Modal from '../Modal/Modal';
import { HeaderWrapper, StatusLabel, StatusWrapper, Title } from './SelectedTaskHeader.styles';

function SelectedTaskHeader({ task }) {
  const [confirmDeleteModalIsOpen, setConfirmDeleteModalIsOpen] = useState(false);
  const [editTaskModalIsOpen, setEditTaskModalIsOpen] = useState(false);
  const { title, status, link } = task;
  const { handleUpdateStatus, handleDeleteTask } = useUpdateTask(task, setConfirmDeleteModalIsOpen);
  return (
    <>
      <HeaderWrapper status={status}>
        <Title>{title}</Title>
        <StatusWrapper>
          <IconButton onClick={() => setEditTaskModalIsOpen(true)}>
            <Edit sx={{ fontSize: 20 }} />
          </IconButton>
          <IconButton onClick={() => setConfirmDeleteModalIsOpen(true)}>
            <Delete sx={{ fontSize: 20 }} />
          </IconButton>
          <IconButton component="a" href={link} target="_blank" rel="noopener noreferrer">
            <LinkIcon sx={{ fontSize: 20 }} />
          </IconButton>
          <StatusLabel>Status:</StatusLabel>
          <Dropdown
            width="100px"
            options={TICKET_STATUSES}
            value={status}
            onChange={handleUpdateStatus}
          />
        </StatusWrapper>
      </HeaderWrapper>
      <Modal
        isOpen={confirmDeleteModalIsOpen}
        title="Confirm Delete Task?"
        onClose={() => setConfirmDeleteModalIsOpen(false)}
        onConfirm={handleDeleteTask}
        showActions
      />
      <AddTaskModal
        isOpen={editTaskModalIsOpen}
        onClose={() => setEditTaskModalIsOpen(false)}
        task={task}
      />
    </>
  );
}
export default SelectedTaskHeader;

import Container from '@mui/material/Container';
import { IconButton } from '@mui/material';
import { Add, Email } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { filterTasks } from '../utils/filterTasks';
import TaskTable from '../components/TaskTable/TaskTable';
import Tabs from '../components/Tabs/Tabs';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import SearchBar from '../components/searchBar/SearchBar';
import AddTaskModal from '../components/AddTaskModal/AddTaskModal';
import GenerateEmailModal from '../components/GenerateEmailModal/GenerateEmailModal';

export default function Tasks() {
  const [activeTab, setActiveTab] = useState(0);
  const tasks = useSelector(state => state.tasks);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [taskModalOpen, setTaskModalOpen] = useState('');
  const [emailModalOpen, setEmailModalOpen] = useState('');

  const tabs = [
    { label: 'active', value: 0 },
    { label: 'closed', value: 1 },
  ];

  const handleChangeTab = (e, value) => {
    setActiveTab(value);
  };

  const handleSetSearchValue = e => {
    const newSearchValue = e.target.value;
    setSearchValue(newSearchValue);
  };

  const handleOpenCloseTaskModal = () => {
    setTaskModalOpen(!taskModalOpen)
  }

  const handleOpenCloseEmailModal = () => {
    setEmailModalOpen(!emailModalOpen)
  }


  useEffect(() => {
    setFilteredTasks(filterTasks(tasks, !activeTab, searchValue));
  }, [tasks, activeTab, searchValue]);

  return (
    <Container maxWidth='xl' sx={{ height: 'calc(100vh - 66px)', gap: '20px', padding: '20px 0', position: 'relative' }}>
      <Tabs tabs={tabs} handleChangeTab={handleChangeTab} value={activeTab} />
      <Box sx={{ display: 'flex', gap: '10px', position: 'absolute', top: '10px', right: '25px', zIndex: 1 }}>
        <SearchBar searchValue={searchValue} setSearchValue={handleSetSearchValue} />
        <IconButton onClick={handleOpenCloseTaskModal} sx={{}}>
          <Add sx={{ fontSize: '30px' }} />
        </IconButton>
        <IconButton onClick={handleOpenCloseEmailModal}>
          <Email sx={{ fontSize: '30px' }} />
        </IconButton>
      </Box>
      <TaskTable tasks={filteredTasks} />
      <AddTaskModal open={taskModalOpen} handleClose={handleOpenCloseTaskModal} />
      <GenerateEmailModal open={emailModalOpen} handleClose={handleOpenCloseEmailModal} />
    </Container>
  );
}

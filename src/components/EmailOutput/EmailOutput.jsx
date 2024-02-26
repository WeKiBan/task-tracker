import { useSelector } from 'react-redux';
import { TextField } from '@mui/material';

export default function EmailOutput({ textFieldRef }) {
  const { tasks, settings } = useSelector(state => state);
  const { emailHeader, emailFooter } = settings;

  const filterAndFormatTasks = tasks => {
    // Filter out tasks with completed: true
    const filteredTasks = tasks.filter(task => task.status !== 'closed');

    // Format and modify tasks
    const formattedTasks = filteredTasks.map(task => {
      return `${task.taskTicketText} ${task?.emailNote && '- (' + task.emailNote + ')'}`;
    });

    const headerFooterTasks = [emailHeader, ...formattedTasks, emailFooter];

    // Concatenate formatted strings with line breaks
    const resultString = headerFooterTasks.join('\n');

    return resultString;
  };

  return <TextField disabled ref={textFieldRef} fullWidth value={filterAndFormatTasks(tasks)} placeholder='...' multiline rows={4} />;
}

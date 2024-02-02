import { useSelector } from "react-redux";
import { TextField } from '@mui/material';

export default function EmailOutput({textFieldRef}) {
  const {tasks, settings} = useSelector((state) => state);
  const {emailHeader, emailFooter} = settings;

  console.log(emailFooter, emailHeader)

  const filterAndFormatTasks = (tasks) => {
    // Filter out tasks with completed: true
    const filteredTasks = tasks.filter(task => task.status !== 'closed');
  
    // Order tasks by priority
    const orderedTasks = filteredTasks.sort((a, b) => (a.priority > b.priority) ? 1 : -1);
  
    // Format and modify tasks
    const formattedTasks = orderedTasks.map(task => {
      let formattedString = `${task.taskTicketText} ${task?.emailNote && '- ('+ task.emailNote + ')'}`;
  
      // Add 4 spaces if status is not equal to "not started"
      if (task.status === "waiting for info") {
        formattedString = "    " + formattedString;
      }

      return formattedString;
    });

    const headerFooterTasks = [emailHeader, ...formattedTasks, emailFooter]
  
    // Concatenate formatted strings with line breaks
    const resultString = headerFooterTasks.join('\n');
  
    return resultString;
  };
  
 
  return (
    <TextField ref={textFieldRef} fullWidth value={filterAndFormatTasks(tasks)} placeholder='...'  multiline rows={4} />
  )
}
import { TICKET_STATUSES } from '../../config/constants';
import { useUpdateTask } from '../../hooks/useUpdateTask';
import Dropdown from '../Dropdown/Dropdown';
import { HeaderWrapper, StatusLabel, StatusWrapper, Title } from './SelectedTaskHeader.styles';

function SelectedTaskHeader({ task }) {
  const { title, status } = task;
  const { handleUpdateStatus } = useUpdateTask(task);
  return (
    <HeaderWrapper status={status}>
      <Title>{title}</Title>
      <StatusWrapper>
        <StatusLabel>Status:</StatusLabel>
        <Dropdown options={TICKET_STATUSES} value={task.status} onChange={handleUpdateStatus} />
      </StatusWrapper>
    </HeaderWrapper>
  );
}
export default SelectedTaskHeader;

import {
  HeaderWrapper,
  Title,
  StatusWrapper,
  StatusLabel,
} from "./SelectedTaskHeader.styles";
import { TICKET_STATUSES } from "../../config/constants";
import Dropdown from "../Dropdown/Dropdown";

function SelectedTaskHeader({ task }) {
  const { title, status } = task;
  return (
    <HeaderWrapper status={status}>
      <Title>{title}</Title>
      <StatusWrapper>
        <StatusLabel>Status:</StatusLabel>
        <Dropdown options={TICKET_STATUSES} value={task.status} />
      </StatusWrapper>
    </HeaderWrapper>
  );
}
export default SelectedTaskHeader;

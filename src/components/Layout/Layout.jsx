import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import NavBar from '../Nav/Nav';
import { LayoutContainer } from './Layout.styles';

export default function Layout({ children }) {
  const { uid, emailVerified } = useSelector((state) => state.auth);
  const location = useLocation();

  // Logic:
  // Show NavBar if:
  // - On home page "/"
  // - OR on task pages AND user is authenticated and verified
  const isTaskPage =
    location.pathname === '/active-tasks' || location.pathname === '/inactive-tasks';

  const showNavBar = location.pathname === '/' || (isTaskPage && uid && emailVerified);

  return (
    <LayoutContainer>
      {showNavBar && <NavBar />}
      {children}
    </LayoutContainer>
  );
}

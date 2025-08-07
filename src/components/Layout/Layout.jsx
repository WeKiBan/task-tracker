import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import NavBar from '../Nav/Nav';
import { LayoutContainer } from './Layout.styles';

export default function Layout({ children }) {
  const { authToken, emailVerified } = useSelector((state) => state.auth);
  const location = useLocation();

  const showNavBar =
    location.pathname === '/active-tasks' ||
    (location.pathname === '/inactive-tasks' && authToken && emailVerified) ||
    location.pathname === '/';

  return (
    <LayoutContainer>
      {showNavBar && <NavBar />}
      {children}
    </LayoutContainer>
  );
}

import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
const ProtectedRoute = () => {
  const user = useSelector(state => state.auth.value);
  return user ? <Outlet /> : <Navigate to='/task-tracker/login' />;
};

export default ProtectedRoute;

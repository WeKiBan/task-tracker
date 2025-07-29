import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const user = useSelector((state) => state.auth.authToken);
  const emailVerified = useSelector((state) => state.auth.emailVerified);

  if (user && emailVerified) {
    return children;
  }
  if (user && !emailVerified) {
    return <Navigate to="/verify-email" />;
  }
  return <Navigate to="/login" />;
}

export default ProtectedRoute;

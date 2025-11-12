// ProtectedRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const { uid, emailVerified, isAuthLoaded } = useSelector((s) => s.auth);

  if (!isAuthLoaded) return null; // or a spinner

  if (!uid) return <Navigate to="/login" replace state={{ from: location }} />;
  if (!emailVerified) return <Navigate to="/verify-email" replace />;
  return children;
}

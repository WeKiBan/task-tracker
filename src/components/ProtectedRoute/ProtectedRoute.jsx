import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.authToken);
  const emailVerified = useSelector((state) => state.auth.emailVerified);

  if (user && emailVerified) {
    return children;
  } else if (user && !emailVerified) {
    return <Navigate to="/verify" />;
  } else {
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;

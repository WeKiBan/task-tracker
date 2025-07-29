import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

import AuthListener from './components/AuthListener/AuthListener';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import store, { persistor } from './redux/store';
import ActiveTasks from './routes/ActiveTasks/ActiveTasks';
import Action from './routes/auth/Action';
import Login from './routes/auth/Login';
import Register from './routes/auth/Register';
import ResetPassword from './routes/auth/ResetPassword';
import Verify from './routes/auth/Verify';
import LandingPage from './routes/Landing';
import theme from './styles/theme';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
        <AuthListener />
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Layout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-email" element={<Verify />} />
              <Route path="/user-actions" element={<Action />} />
              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    <ActiveTasks />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Layout>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;

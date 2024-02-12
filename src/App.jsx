import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Tasks from './routes/Tasks';
import Settings from './routes/Settings';
import store from './redux/store';
import { Provider } from 'react-redux';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from './styles/theme';
import Register from './routes/auth/Register';
import Reset from './routes/auth/Reset';
import LoginForm from './routes/auth/Login';
import ProtectedRoute from './utils/ProtectedRoute';
import AuthListener from './components/AuthListener/AuthListener';

const App = () => {
  return (
    <Provider store={store}>
      <AuthListener />
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout>
          <Routes>
            <Route path='/task-tracker/login' element={<LoginForm />} />
            <Route path='/task-tracker/register' element={<Register />} />
            <Route path='/task-tracker/reset' element={<Reset />} />
            <Route element={<ProtectedRoute/>}>
              <Route path='/task-tracker/' element={<Tasks />} exact />
              <Route path='/task-tracker/settings' element={<Settings />} />
            </Route>
          </Routes>
        </Layout>
      </ThemeProvider>
    </Provider>
  );
};

export default App;

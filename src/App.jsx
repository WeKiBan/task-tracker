import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Tasks from './routes/Tasks';
import store from './redux/store';
import { Provider } from 'react-redux';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import theme from './styles/theme';

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Routes>
          <Route path='/task-tracker/' element={<Tasks />} />
        </Routes>
      </Layout>
      </ThemeProvider>
    </Provider>
  );
};

export default App;

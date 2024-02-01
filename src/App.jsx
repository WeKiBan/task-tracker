import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import ActiveTasks from './routes/ActiveTasks';
import store from './store';
import { Provider } from 'react-redux';
import { CssBaseline } from '@mui/material';
import ClosedTasks from './routes/ClosedTasks';

const App = () => {
  return (
    <Provider store={store}>
      <CssBaseline />
      <Layout>
        <Routes>
          <Route path='/task-tracker/' element={<ActiveTasks />} />
          <Route path='/task-tracker/closed-tasks' element={<ClosedTasks />} />
        </Routes>
      </Layout>
    </Provider>
  );
};

export default App;

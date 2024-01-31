import { Provider } from 'react-redux';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout/Layout';
import store from './store';

function App() {
  return (
    <>
      <CssBaseline />
      <Provider store={store}>
          <Layout />
      </Provider>
    </>
  );
}

export default App;

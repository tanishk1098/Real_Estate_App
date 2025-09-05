import AppRoutes from './AppRoutes';
import { ToastContainer } from 'react-toastify';
 const App = () => {
  return (
    <div className='w-full overflow-hidden'>
      <AppRoutes />
      <ToastContainer />
    </div>
  );
};
export default App;


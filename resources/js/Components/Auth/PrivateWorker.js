import { Outlet } from "react-router"; 
import { Navigate } from 'react-router-dom';

const useAuth = () => {
  var user = { loggedIn: true };

  if(localStorage.getItem('worker-token')) {
     user = { loggedIn: true };
  } else {
    user = { loggedIn: false };
 }
 
  return user && user.loggedIn;
}

const WorkerProtectedRoutes = () => {
  const isAuth = useAuth(); 
  return isAuth ? <Outlet /> : <Navigate replace to="worker/login" />
}

export default WorkerProtectedRoutes;

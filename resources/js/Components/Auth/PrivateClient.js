import { Outlet } from "react-router";
import { Navigate } from 'react-router-dom';

const useAuth = () => {
  var user = { loggedIn: true };

  if(localStorage.getItem('client-token')) {
     user = { loggedIn: true };
  } else {
    user = { loggedIn: false };
 }
 
  return user && user.loggedIn;
}

const clientProtectedRoutes = () => {
  const isAuth = useAuth(); 
  return isAuth ? <Outlet /> : <Navigate replace to="client/login" />
}

export default clientProtectedRoutes


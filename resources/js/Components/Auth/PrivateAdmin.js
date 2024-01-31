import { Outlet } from "react-router";
import { Navigate } from 'react-router-dom';

const useAdminAuth = () => {
  var admin = { AdminloggedIn: false };

  if(localStorage.getItem('admin-token')) {

    getWithExpiry('admin-token');

     admin = { AdminloggedIn: true };
  } else {
     admin = { AdminloggedIn: false };
  }

  return admin && admin.AdminloggedIn;
}

const AdminProtectedRoutes = () => {
  const isAuth = useAdminAuth();
  return isAuth ? <Outlet /> : <Navigate replace to="/" />
}

function getWithExpiry(key) {
  const itemStr = localStorage.getItem(key)

  // if the item doesn't exist, return null
  if (!itemStr) {
    return null
  }

  try {
    const item = JSON.parse(itemStr)
  
    const now = new Date()
  

    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key)
      return null
    }
    return item.value

  } catch(err) {
      localStorage.removeItem('tokenkey');
  }

  



}

export default AdminProtectedRoutes


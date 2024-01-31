import React from 'react'
import ClientProtectedRoutes from '../Components/Auth/PrivateClient'
import ClientHeader from './Layouts/ClientHeader'
import { Outlet } from "react-router-dom";

export default function Employee() {
  return (
    <div>
        <ClientHeader/>
            <ClientProtectedRoutes>
              <Outlet/>
          </ClientProtectedRoutes>
    </div>
  )
}

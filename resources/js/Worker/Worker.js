import React from 'react'
import WorkerProtectedRoutes from '../Components/Auth/PrivateWorker'
import WorkerHeader from './Layouts/WorkerHeader'
import { Outlet } from "react-router-dom";



export default function Worker() {
  return (
    <div>
           <WorkerHeader/>
            <WorkerProtectedRoutes>
              <Outlet/>
          </WorkerProtectedRoutes>
    </div>
)
}

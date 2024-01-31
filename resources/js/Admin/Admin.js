
import React from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "./Layouts/Header";

export default function Admin(props) {
    return (
        <div>
            <AdminHeader />
            <Outlet />
        </div>
    );
}

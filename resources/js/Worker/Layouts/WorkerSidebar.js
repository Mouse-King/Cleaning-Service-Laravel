import React from "react";
import { useAlert } from "react-alert";
import { useNavigate,Link } from "react-router-dom";
import logo from "../../Assets/image/sample.svg";
import { NavLink } from 'react-router-dom';
import { useTranslation } from "react-i18next";

export default function WorkerSidebar() {

    const alert = useAlert();
    const name = localStorage.getItem("admin-name");
    const navigate = useNavigate();
    const {t} = useTranslation();
    const HandleLogout = (e) => {
        fetch("/api/logout", {
            method: "POST",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json",
                "Authorization": `Bearer ` + localStorage.getItem("worker-token"),
            },
        }).then((res) => {
            if (res.status === 200) {
                localStorage.removeItem("worker-token");
                localStorage.removeItem("worker-name");
                localStorage.removeItem("worker-id");
                navigate("/worker/login");
                alert.success("Logged Out Successfully");
            }
        });
        localStorage.removeItem("worker-token");
        localStorage.removeItem("worker-name");
        localStorage.removeItem("worker-id");
        navigate("/worker/login");
        alert.success("Logged Out Successfully");
    };

    return (
        <div id="column-left">
            <div className="sideLogo">
                <Link to="/worker/dashboard">
                    <svg width="190" height="77" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">       
                        <image xlinkHref={logo} width="190" height="77"></image>
                    </svg>
                </Link>
            </div>
            <ul className="list-group">
                <li className="list-group-item">
                    <NavLink to="/worker/dashboard"><i className="fa-solid fa-gauge"></i>{t('worker.sidebar.dashboard')}</NavLink>
                </li>
                <li className="list-group-item">
                    <NavLink to="/worker/jobs"><i className="fa-solid fa-briefcase"></i>{t('worker.sidebar.jobs')}</NavLink>
                </li>
                 <li className="list-group-item">
                    <NavLink to="/worker/schedule"><i className="fa-solid fa-clipboard-list"></i>{t('worker.sidebar.schedule')}</NavLink>
                </li>
                 <li className="list-group-item">
                    <NavLink to="/worker/not-available"><i className="fa-solid fa-clipboard-list"></i>{t('worker.sidebar.not_available')}</NavLink>
                </li>
                <li className="list-group-item">
                    <NavLink to="/worker/my-account"><i className="fa-solid fa-user"></i>{t('worker.my_account')}</NavLink>
                </li>
            </ul>
            <div className="sideLogout">
                <div className="logoutBtn">
                    <button className="btn btn-white" onClick={HandleLogout}>
                    {t('worker.logout')}
                    </button>
                </div>
            </div>
        </div>
    );
}

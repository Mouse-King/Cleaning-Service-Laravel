import React from 'react'
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";
import logo from "../../Assets/image/sample.svg";
import bars from "../../Assets/image/icons/bars.svg";
import { useTranslation } from 'react-i18next';

export default function WorkerMobileHeader() {
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
    <div className='mobileNav hidden-xl'>
        <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
            <a className="navbar-brand" href="/worker/dashboard">
                <svg width="190" height="77" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">       
                    <image xlinkHref={logo} width="190" height="77"></image>
                </svg>
            </a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <span className="icon-bar">
                    <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">       
                        <image xlinkHref={bars} height="30" width="30"/>
                    </svg>
                </span>
            </button>
            <div className="collapse navbar-collapse" id="navbarCollapse">
                <ul className="navbar-nav mr-auto">
                    <li className='nav-item'>
                        <a href="/worker/dashboard"><i className="fa-solid fa-gauge"></i>{t('worker.sidebar.dashboard')}</a>
                    </li>
                    <li className='nav-item'>
                        <a href="/worker/jobs"><i className="fa-solid fa-briefcase"></i>{t('worker.sidebar.jobs')}</a>
                    </li>
                    <li className='nav-item'>
                        <a href="/worker/schedule"><i className="fa-solid fa-video"></i>{t('worker.sidebar.schedule')}</a>
                    </li>
                    <li className='nav-item'>
                        <a href="/worker/my-account"><i className="fa-solid fa-gear"></i>{t('worker.my_account')}</a>
                    </li> 
                </ul>
                <div className='sideLogout'>
                    <div className='logoutBtn'>
                        <button className='btn btn-danger' onClick = { HandleLogout } >{t('worker.logout')}</button>
                    </div>
                </div>
            </div>
        </nav>
    </div>
  )
}

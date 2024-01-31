import React from 'react'
import logo from "../../Assets/image/sample.svg";
import bars from "../../Assets/image/icons/bars.svg";
import { useNavigate} from "react-router-dom";
import { useAlert } from "react-alert";

export default function ClientMobileHeader() {
    const alert = useAlert();
    const name = localStorage.getItem("admin-name");
    const navigate = useNavigate();

    const HandleLogout = (e) => {
        fetch("/api/client/logout", {
            method: "POST",
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json",
                "Authorization": `Bearer ` + localStorage.getItem("client-token"),
            },
        }).then((res) => {
            if (res.status === 200) {
                localStorage.removeItem("client-token");
                localStorage.removeItem("client-name");
                localStorage.removeItem("client-id");
                navigate("/client/login");
                alert.success("Logged Out Successfully");
            }
        });
        localStorage.removeItem("client-token");
        localStorage.removeItem("client-name");
        localStorage.removeItem("client-id");
        navigate("/client/login");
        alert.success("Logged Out Successfully");
    };
  return (
    <div className='mobileNav hidden-xl'>
        <nav className="navbar navbar-expand-lg navbar-dark fixed-top">
            <a className="navbar-brand" href="/client/dashboard">
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
                        <a href="/client/dashboard"><i className="fa-solid fa-gauge"></i>Dashboard</a>
                    </li>
                    <li className='nav-item'>
                        <a href="/client/schedule"><i className="fa-solid fa-video"></i>Scheduled Meetings</a>
                    </li>
                    <li className='nav-item'>
                        <a href="/client/offered-price"><i className="fa-solid fa-tags"></i>Offered Prices</a>
                    </li>
                    <li className='nav-item'>
                        <a href="/client/contracts"><i className="fa-solid fa-clipboard-list"></i>Contracts</a>
                    </li>
                    <li className='nav-item'>
                        <a href="/client/jobs"><i className="fa-solid fa-briefcase"></i>Jobs</a>
                    </li>
                    <li className='nav-item'>
                        <a href="/client/settings"><i className="fa-solid fa-gear"></i>Settings</a>
                    </li> 
                </ul>
                <div className='sideLogout'>
                    <div className='logoutBtn'>
                        <button className='btn btn-danger' onClick = { HandleLogout } >Logout</button>
                    </div>
                </div>
            </div>
        </nav>
    </div>
  )
}

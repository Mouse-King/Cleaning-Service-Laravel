import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";
import logo from "../../Assets/image/sample.svg";
import { NavLink } from 'react-router-dom';
import axios from "axios";

export default function Sidebar() {

    const alert = useAlert();
    const name = localStorage.getItem("admin-name");
    const navigate = useNavigate();
    const [role, setRole] = useState();
    const headers = {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "Authorization": `Bearer ` + localStorage.getItem("admin-token"),
    }

    const getAdmin = () => {
        axios
            .get(`/api/admin/details`, { headers })
            .then((res) => {
                setRole(res.data.success.role);
            });
    };
    const HandleLogout = (e) => {
        fetch("/api/admin/logout", {
            method: "POST",
            headers,
        }).then((res) => {
            if (res.status === 200) {
                localStorage.removeItem("admin-token");
                localStorage.removeItem("admin-name");
                localStorage.removeItem("admin-id");
                navigate("/admin/login");
                alert.success("Logged Out Successfully");
            }
        });
        localStorage.removeItem("admin-token");
        localStorage.removeItem("admin-name");
        localStorage.removeItem("admin-id");
        navigate("/admin/login");
        alert.success("Logged Out Successfully");
    };
    useEffect(() => {
        getAdmin();
    }, []);

    return (
        <div id="column-left">
            <div className="sideLogo">
                <Link to="/admin/dashboard">
                    <svg width="190" height="77" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                        <image xlinkHref={logo} width="190" height="77"></image>
                    </svg>
                </Link>
            </div>
            <ul className="list-group">
                <li className="list-group-item">
                    <NavLink to="/admin/dashboard"><i className="fa-solid fa-gauge"></i>Dashboard</NavLink>
                </li>
                <li className="list-group-item">
                    <NavLink to="/admin/leads"><i className="fa-solid fa-poll-h"></i>Leads</NavLink>
                </li>
                <li className="list-group-item">
                    <NavLink to="/admin/clients"><i className="fa-solid fa-user-tie"></i>Clients</NavLink>
                </li>
                <li className="list-group-item">
                    <NavLink to="/admin/workers"><i className="fa-solid fa-users"></i>Workers</NavLink>
                </li>
                <li className="list-group-item">
                    <NavLink to="/admin/schedule"><i className="fa-solid fa-video"></i>Scheduled Meetings</NavLink>
                </li>
                <li className="list-group-item">
                    <NavLink to="/admin/offered-price"><i className="fa-solid fa-tags"></i>Offered Prices</NavLink>
                </li>
                <li className="list-group-item">
                    <NavLink to="/admin/contracts"><i className="fa-solid fa-clipboard-list"></i>Contracts</NavLink>
                </li>
                <li className="list-group-item">
                    <NavLink to="/admin/jobs"><i className="fa-solid fa-briefcase"></i>Jobs</NavLink>
                </li>
              

                <li className="list-group-item">
                    <div id="myFence" className='fence commonDropdown'>
                        <div id="fencehead2">
                            <a href="#" className="text-left btn btn-header-link" data-toggle="collapse" data-target="#fence2121" aria-expanded="true" aria-controls="fence2121">
                                <i className="fa-solid fa-message"></i> Whatsapp chat <i className="fa-solid fa-angle-down"></i>
                            </a>
                        </div>
                        <div id="fence2121" className="collapse" aria-labelledby="fencehead2" data-parent="#fence">
                            <div className="card-body">
                            <ul className='list-group'>
                                    <li className='list-group-item'>
                                        <Link to="/admin/chat"><i className="fa fa-angle-right"></i> Chat History </Link>
                                    </li>
                                    <li className='list-group-item'>
                                        <Link to="/admin/responses"><i className="fa fa-angle-right"></i> Whatsapp Responses </Link>
                                    </li>
                                 
                                </ul>
                            </div>
                        </div>
                    </div>
                </li>

                <li className="list-group-item">
                        <NavLink to="/admin/messenger"><i className="fa-solid fa-comment"></i>Messenger Chat</NavLink>
                </li>


                <li className="list-group-item">
                    <div id="myFence" className='fence commonDropdown'>
                        <div id="fencehead2">
                            <a href="#" className="text-left btn btn-header-link" data-toggle="collapse" data-target="#fence21" aria-expanded="true" aria-controls="fence21">
                                <i className="fa-solid fa-file-invoice"></i> Sales <i className="fa-solid fa-angle-down"></i>
                            </a>
                        </div>
                        <div id="fence21" className="collapse" aria-labelledby="fencehead2" data-parent="#fence">
                            <div className="card-body">
                            <ul className='list-group'>
                                    <li className='list-group-item'>
                                        <Link to="/admin/orders"><i className="fa fa-angle-right"></i> Orders </Link>
                                    </li>
                                    <li className='list-group-item'>
                                        <Link to="/admin/invoices"><i className="fa fa-angle-right"></i> Invoices </Link>
                                    </li>
                                    <li className='list-group-item'>
                                        <Link to="/admin/payments"><i className="fa fa-angle-right"></i> Payments </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </li>

                {
                    role !== 'member' &&
                    <li className="list-group-item">
                        <NavLink to="/admin/income"><i className="fa-solid fa-ils"></i>Income / Outcome</NavLink>
                    </li>

                }
                <li className="list-group-item">
                    <NavLink to="/admin/notifications"><i className="fa-solid fa-bullhorn"></i>Notifications</NavLink>
                </li>

                <li className="list-group-item">
                    <div id="myFence" className='fence commonDropdown'>
                        <div id="fencehead2">
                            <a href="#" className="text-left btn btn-header-link" data-toggle="collapse" data-target="#fence2" aria-expanded="true" aria-controls="fence2">
                                <i className="fa-solid fa-gear"></i> Settings <i className="fa-solid fa-angle-down"></i>
                            </a>
                        </div>
                        <div id="fence2" className="collapse" aria-labelledby="fencehead2" data-parent="#fence">
                            <div className="card-body">
                                <ul className='list-group'>
                                    {
                                        role !== 'member' &&
                                        <li className='list-group-item'>
                                            <Link to="/admin/manage-team"><i className="fa fa-angle-right"></i> Manage team</Link>
                                        </li>
                                    }
                                    <li className='list-group-item'>
                                        <Link to="/admin/services"><i className="fa fa-angle-right"></i> Services</Link>
                                    </li>
                                    <li className='list-group-item'>
                                        <Link to="/admin/manage-time"><i className="fa fa-angle-right"></i> Manage Time</Link>
                                    </li>
                                    {/*<li className='list-group-item'>
                                        <Link to="/admin/languages"><i className="fa fa-angle-right"></i>Languages</Link>
                                    </li>*/}
                                    <li className='list-group-item'>
                                        <Link to="/admin/settings"><i className="fa fa-angle-right"></i> My Account</Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
            <div className="sideLogout">
                <div className="logoutBtn">
                    <button className="btn btn-white" onClick={HandleLogout}>
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

import React, { useEffect, useState } from "react";
import Sidebar from "./Layouts/Sidebar";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import UserIcon from "../Assets/image/icons/user-client.jpeg";
import Jobs from './Components/Dashboard/jobs';
import Pendings from './Components/Dashboard/pendings';

export default function AdminDashboard() {
    const [totalJobs, setTotalJobs] = useState([0]);
    const [totalClients, setTotalClients] = useState([0]);
    const [totalWorkers, setTotalWorkers] = useState([0]);
    const [totalOffers, setTotalOffers] = useState([0]);
    const [totalSchedules, setTotalSchedules] = useState([0]);
    const [contracts, setContracts] = useState([0]);
    const [latestJobs, setlatestJobs] = useState([]);
    const [income,setIncome] = useState(0);
    const [loading, setLoading] = useState("Loading...");
    const [latestClient,setLatestClients] = useState([]);
    const [pageCount,setPageCount] = useState(0);
    const [role,setRole] = useState('');

    const navigate = useNavigate();
    
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };

    const getCompletedJobs = () => {
        axios.get("/api/admin/dashboard", { headers }).then((response) => {
            setTotalJobs(response.data.total_jobs);
            setTotalClients(response.data.total_clients);
            setTotalWorkers(response.data.total_workers);
            setTotalOffers(response.data.total_offers);
            setContracts(response.data.total_contracts);
            setTotalSchedules(response.data.total_schedules);
            if (response.data.latest_jobs.length > 0) {
                setlatestJobs(response.data.latest_jobs);
            } else {
                setLoading("No job found");
            }
        });
    };

    const rowHandle = (e,id) =>{
      e.preventDefault();
      navigate(`/admin/view-job/${id}`);
    }

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Delete Job!",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`/api/admin/jobs/${id}`, { headers })
                    .then((response) => {
                        Swal.fire(
                            "Deleted!",
                            "Job has been deleted.",
                            "success"
                        );
                        setTimeout(() => {
                            GetDashboardData();
                        }, 1000);
                    });
            }
        });
    };

    const copy = [...latestJobs];
    const [order,setOrder] = useState('ASC');
    const sortTable = (col) =>{
        
        if(order == 'ASC'){
            const sortData = [...copy].sort((a, b) => (a[col] < b[col] ? 1 : -1));
            setlatestJobs(sortData);
            setOrder('DESC');
        }
        if(order == 'DESC'){
            const sortData = [...copy].sort((a, b) => (a[col] < b[col] ? -1 : 1));
            setlatestJobs(sortData);
            setOrder('ASC');
        }
        
    }

    const getIncome = (duration) => {
        axios
            .post('/api/admin/income', {duration},{ headers })
            .then((res) => {
                if (res.data.tasks.length > 0) {
                    setIncome(res.data.income);
                } else {
                    setIncome(0);
                    setLoading('No Completed Tasks found.');
                }
            });
    }

    const latestClients = () => {
        axios
        .get(`/api/admin/latest-clients`,{ headers })
        .then((res)=>{
            if(res.data.clients.data.length > 0) {
                setLatestClients(res.data.clients.data);
                setPageCount(res.data.clients.last_page);
            } else{
                setPageCount(0);
                setLoading('No client found!');
            }
        })
    }

    const getAdmin = () =>{
        axios
        .get(`/api/admin/details`,{ headers })
        .then((res)=>{
            setRole(res.data.success.role);
        });
    };

    useEffect(() => {
        getCompletedJobs();
        getIncome();
        latestClients();
        getAdmin();
    }, []);
    
    return (
        <div id="container">
            <Sidebar />
            <div id="content">
                <div className="adminDash">
                    <div className="titleBox">
                        <h1 className="page-title">Dashboard</h1>
                    </div>
                    <div className="row">
                        <div className="col-sm-4 col-xs-6">
                            <a href="/admin/jobs">
                                <div className="dashBox">
                                    <div className="dashIcon">
                                        <i className="fa-solid fa-suitcase"></i>
                                    </div>
                                    <div className="dashText">
                                        <h3>{totalJobs}</h3>
                                        <p>Jobs posted</p>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div className="col-sm-4 col-xs-6">
                            <a href="/admin/clients">
                                <div className="dashBox">
                                    <div className="dashIcon">
                                        <i className="fa-regular fa-user"></i>
                                    </div>
                                    <div className="dashText">
                                        <h3>{totalClients}</h3>
                                        <p>Clients</p>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div className="col-sm-4 col-xs-6">
                            <a href="/admin/workers">
                                <div className="dashBox">
                                    <div className="dashIcon">
                                        <i className="fa-solid fa-user"></i>
                                    </div>
                                    <div className="dashText">
                                        <h3>{totalWorkers}</h3>
                                        <p>Workers</p>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div className="col-sm-4 col-xs-6">
                            <a href="/admin/schedule">
                                <div className="dashBox">
                                    <div className="dashIcon">
                                        <i className="fa-solid fa-handshake"></i>
                                    </div>
                                    <div className="dashText">
                                        <h3>{totalSchedules}</h3>
                                        <p>Meetings</p>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div className="col-sm-4 col-xs-6">
                            <a href="/admin/offered-price">
                                <div className="dashBox">
                                    <div className="dashIcon">
                                        <i className="fa-solid fa-dollar-sign"></i>
                                    </div>
                                    <div className="dashText">
                                        <h3>{totalOffers}</h3>
                                        <p>Offered Prices</p>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div className="col-sm-4 col-xs-6">
                            <a href="/admin/contracts">
                                <div className="dashBox">
                                    <div className="dashIcon">
                                        <i className="fa-solid fa-file-contract"></i>
                                    </div>
                                    <div className="dashText">
                                        <h3>{contracts}</h3>
                                        <p>Contracts</p>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-9">
                            <div className="view-applicant">
                                <h2 className="page-title">Jobs Schedule</h2>
                                <div className="ClientHistory">
                                     <Jobs />
                                     <Pendings/>
                                </div>
                            </div> 
                            { 
                            (role && role == 'superadmin') &&
                            <>
                            <h2 className="page-title">Income/Outcome</h2>
                            <div className="inoutEarning boxPanel card p-3">
                                <div className="row">
                                    <div className="col-sm-6">
                                        <h4>Income <span style={{color: "green"}}>{ income } ILS</span></h4>
                                        <h4>Outcome <span style={{color: "purple"}}>{ 0 } ILS</span></h4>
                                    </div>
                                    
                                </div>
                            </div>
                            </>
                            }
                        </div>
                        <div className="col-sm-3">
                            <h2 className="page-title pt-0">Recent Users</h2>
                            <div className="boxPanel card">
                               
                               {
                                 latestClient && latestClient.map((c,i)=>{
                                    return (
                                         
                                        <div className="list-group-item d-flex  align-items-center border-top-0 border-left-0 border-right-0">
                                        <div className="mr-2">
                                            <img className="img-profile rounded-circle" src={UserIcon} alt="User Today" style={{width: "3rem", height: "3rem"}} />
                                        </div>
                                        <div className="users">
                                            <div className="font-weight-semibold user-add">{ (c) ? c.firstname+" "+c.lastname: 'NA'}</div>
                                            <small className="text-muted"> Client</small>
                                        </div>
                                        <div className="ml-auto">
                                            {(c) ?
                                            <Link  to={`/admin/view-client/${c.id}`} className="btn btn-sm btn-warning">View</Link>
                                            :  <Link  to={`#`} className="btn btn-sm btn-warning">View</Link>
                                            }
                                        </div>
                                    </div>

                                    )
                                 })
                               }
                               


                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

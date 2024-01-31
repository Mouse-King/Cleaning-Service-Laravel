import React, { useEffect, useState } from "react";
import WorkerSidebar from "./Layouts/WorkerSidebar";
import axios from "axios";
import {  Link } from "react-router-dom";
import {Table, Thead, Tbody, Tr, Th, Td} from 'react-super-responsive-table'
import { useTranslation } from "react-i18next";
export default function WorkerDashboard() {

    const [totalJobs, setTotalJobs] = useState([0]);
    const [totalOffers, setTotalOffers] = useState([0]);
    const [totalSchedules, setTotalSchedules] = useState([0]);
    const [latestJobs, setlatestJobs] = useState([]);
    const [contracts, setContract] = useState([]);
    const [loading, setLoading] = useState("Loading...");
    const id = localStorage.getItem('worker-id');
    const {t,i18n } = useTranslation();
    const w_lng = i18n.language;

    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("worker-token"),
    };

    const GetDashboardData = () => {
        axios.post("/api/dashboard",{id:id}, { headers }).then((response) => {
            setTotalJobs(response.data.total_jobs);
            if (response.data.latest_jobs.length > 0) {
                setlatestJobs(response.data.latest_jobs);
            } else {
                setLoading("No job found");
            }
        });
    };
    
    useEffect(() => {
        GetDashboardData();
    }, []);
    

    return (
        <div id="container">
            <WorkerSidebar />
            <div id="content">
                <div className="adminDash">
                    <div className="titleBox">
                        <h1 className="page-title">{t('worker.sidebar.dashboard')}</h1>
                    </div>
                    <div className="row">
                        <div className="col-sm-3 col-xs-6">
                            <a href="/worker/jobs">
                                <div className="dashBox">
                                    <div className="dashIcon mr-3">
                                        <i className="fa-solid fa-suitcase"></i>
                                    </div>
                                    <div className="dashText">
                                        <h3>{totalJobs}</h3>
                                        <p>{t('worker.sidebar.jobs')}</p>
                                    </div>   
                                </div>
                            </a>
                        </div>
                    </div>
                    <div className="latest-users">
                        <h2 className="page-title">{t('worker.dashboard.recent_jobs')}</h2>
                        <div className="boxPanel">
                            <div className="table-responsive">
                                {latestJobs.length > 0 ? (
                                    <Table className="table table-bordered responsiveTable">
                                        <Thead>
                                            <Tr>
                                                <Th>{t('worker.dashboard.client_name')}</Th>
                                                <Th>{t('worker.dashboard.service_name')}</Th>
                                                <Th>{t('worker.dashboard.date')}</Th>
                                                <Th>{t('worker.dashboard.shift')}</Th>
                                                <Th>{t('worker.dashboard.status')}</Th>
                                                <Th>{t('worker.dashboard.action')}</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {latestJobs &&
                                                latestJobs.map(
                                                    (item, index) => {
                                                       let services =  (item.offer) ? JSON.parse(item.offer.services) : [];
                                                   
                                                    return (

                                                        <Tr key={index}>
                                                                <Td>{
                                                            item.client
                                                                ? item.client.firstname +
                                                                " " + item.client.lastname
                                                                : "NA"
                                                        }
                                                        </Td>
                                                        <Td>{
                                                            item.jobservice && item.jobservice.map((s,i)=>{
                                                                return (
                                                                    (w_lng=='en')
                                                                    ? (s.name)
                                                                    :
                                                                    (s.heb_name)
                                                                )
                                                            })
                                                         
                                                        }</Td>
                                                        <Td>
                                                            {item.start_date}
                                                        </Td>
                                                        <Td>
                                                            {item.shifts}
                                                        </Td>

                                                        <Td
                                                            style={{
                                                                textTransform:
                                                                    "capitalize",
                                                            }}
                                                        >
                                                            {item.status}
                                                        </Td>
                                                            <Td>
                                                                <div className="d-flex">
                                                                    
                                                                    <Link
                                                                        to={`/worker/view-job/${item.id}`}
                                                                        className="ml-2 btn bg-yellow"
                                                                    >
                                                                        <i className="fa fa-eye"></i>
                                                                    </Link>

                                                                   
                                                                </div>
                                                                    </Td>
                                                        </Tr>
                                                    )
                                                     }
                                                                    )}
                                        </Tbody>
                                    </Table>
                                ) : (
                                    <p className="text-center mt-5">
                                        {loading}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

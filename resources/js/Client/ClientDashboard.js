import React, { useEffect, useState } from "react";
import ClientSidebar from "./Layouts/ClientSidebar";
import axios from "axios";
import { Link } from "react-router-dom";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import { useTranslation } from "react-i18next";
import { Base64 } from "js-base64";

export default function ClientDashboard() {

    const [totalJobs, setTotalJobs] = useState([0]);
    const [totalOffers, setTotalOffers] = useState([0]);
    const [totalSchedules, setTotalSchedules] = useState([0]);
    const [latestJobs, setlatestJobs] = useState([]);
    const [contracts, setContract] = useState([]);
    const [loading, setLoading] = useState("Loading...");
    const id = localStorage.getItem('client-id');
    const { t, i18n } = useTranslation();
    const c_lng = i18n.language;
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("client-token"),
    };

    const GetDashboardData = () => {
        axios.post("/api/client/dashboard", { id: id }, { headers }).then((response) => {
            setTotalJobs(response.data.total_jobs);
            setTotalOffers(response.data.total_offers);
            setTotalSchedules(response.data.total_schedules);
            setContract(response.data.total_contracts);
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
    const show_shift = [
        "Full Day",
        "Morning",
        'Afternoon',
        'Evening',
        'Night'
    ];
    const getShift = (shifts) => {
        if(shifts != null) {
        let s = (shifts).split(",");
        let check = '';
        let new_shift = '';
        show_shift.map((p) => {
            if (p == 'Afternoon') {
                check = 'noon';
            } else {
                check = p;
            }
            s.map((sh) => {
                if (sh.includes(check.toLowerCase())) {
                    if (new_shift == '') {
                        new_shift = p;
                    } else {
                        if (!new_shift.includes(p)) {
                            new_shift = t('global.' + (new_shift).toLowerCase()) + ' | ' + t('global.' + p.toLowerCase());
                        }
                    }

                }
            })
        })
        if (new_shift == 'Full Day') return t('global.fullday');
        if (new_shift == 'Morning') return t('global.morning');
        if (new_shift == 'Noon') return t('global.noon');
        if (new_shift == 'Afternoon') return t('global.afternoon');
        if (new_shift == 'Evening') return t('global.evening');
        return new_shift;
    }

    }


    return (
        <div id="container">
            <ClientSidebar />
            <div id="content">
                <div className="adminDash andClient">
                    <div className="titleBox">
                        <h1 className="page-title">{t('client.sidebar.dashboard')}</h1>
                    </div>
                    <div className="row">
                        <div className="col-sm-3 col-xs-6">
                            <a href="/client/jobs">
                                <div className="dashBox">
                                    <div className="dashIcon mr-4">
                                        <i class="fa-solid fa-suitcase"></i>
                                    </div>
                                    <div className="dashText">
                                        <h3>{totalJobs}</h3>
                                        <p>{t('client.dashboard.jobs')}</p>
                                    </div>
                                </div>
                            </a>
                        </div>

                        <div className="col-sm-3 col-xs-6">
                            <a href="/client/schedule">
                                <div className="dashBox">
                                    <div className="dashIcon mr-4">
                                        <i className="fa-solid fa-handshake"></i>
                                    </div>
                                    <div className="dashText">
                                        <h3>{totalSchedules}</h3>
                                        <p>{t('client.dashboard.meetings')}</p>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div className="col-sm-3 col-xs-6">
                            <a href="/client/offered-price">
                                <div className="dashBox">
                                    <div className="dashIcon mr-4">
                                        <i className="fa-solid fa-dollar-sign"></i>
                                    </div>
                                    <div className="dashText">
                                        <h3>{totalOffers}</h3>
                                        <p>{t('client.dashboard.offered_price')}</p>
                                    </div>
                                </div>
                            </a>
                        </div>
                        <div className="col-sm-3 col-xs-6">
                            <a href="/client/contracts">
                                <div className="dashBox">
                                    <div className="dashIcon mr-4">
                                        <i className="fa-solid fa-file-contract"></i>
                                    </div>
                                    <div className="dashText">
                                        <h3>{contracts}</h3>
                                        <p>{t('client.dashboard.contracts')}</p>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>
                    <div className="latest-users">
                        <h2 className="page-title">{t('client.dashboard.recent_jobs')}</h2>
                        <div className="boxPanel">
                            <div className="table-responsive">
                                {latestJobs.length > 0 ? (
                                    <Table className="table table-bordered responsiveTable">
                                        <Thead>
                                            <Tr>
                                                <Th style={{ display: 'none' }}>{t('client.dashboard.client_name')}</Th>
                                                <Th>{t('client.dashboard.service_name')}</Th>
                                                <Th>{t('client.dashboard.date')}</Th>
                                                <Th>{t('client.dashboard.shift')}</Th>
                                                <Th style={{ display: 'none' }}>{t('client.dashboard.assigned_worker')}</Th>
                                                <Th>{t('client.dashboard.status')}</Th>
                                                <Th>{t('client.dashboard.total')}</Th>
                                                <Th>{t('client.dashboard.action')}</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {latestJobs &&
                                                latestJobs.map(
                                                    (item, index) => {

                                                        let status = item.status;
                                                        if (status == "not-started") { status = t("j_status.not-started"); }
                                                        if (status == "progress") { status = t("j_status.progress"); }
                                                        if (status == "completed") { status = t("j_status.completed"); }
                                                        if (status == "scheduled") { status = t("j_status.scheduled"); }
                                                        if (status == "unscheduled") { status = t("j_status.unscheduled"); }
                                                        if (status == "re-scheduled") { status = t("j_status.re-scheduled"); }
                                                        if (status == "cancel") { status = t("j_status.cancel"); }
                                                        let total = 0;
                                                        return (
                                                            <Tr key={index}>
                                                                <Td style={{ display: 'none' }}>{
                                                                    item.client
                                                                        ? item.client.firstname +
                                                                        " " + item.client.lastname
                                                                        : "NA"
                                                                }
                                                                </Td>
                                                                <Td>{
                                                                    item.jobservice && item.jobservice.map((js,i)=>{
                                                                        total += parseInt(js.total);
                                                                        return(
                                                                            (c_lng == 'en')
                                                                            ? (js.name)
                                                                            :
                                                                            (js.heb_name)
                                                                        )
                                                                    })
                                                                   
                                                                }</Td>
                                                                <Td>
                                                                    {status}
                                                                </Td>
                                                                <Td>
                                                                    {getShift(item.shifts)}
                                                                </Td>
                                                                <Td style={{ display: 'none' }}>{
                                                                    item.worker
                                                                        ? item.worker.firstname +
                                                                        " " + item.worker.lastname
                                                                        : "NA"
                                                                }</Td>

                                                                <Td>
                                                                    {status}
                                                                    {(item.status == 'cancel') ? `(With Cancellatiom fees ${item.rate} ${t('global.currency')} )` : ''}
                                                                </Td>
                                                                <Td>
                                                                    {total + " " + t('global.currency')}
                                                                </Td>
                                                                <Td>
                                                                    <div className="d-flex">

                                                                        <Link
                                                                            to={`/client/view-job/${Base64.encode(item.id.toString())}`}
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

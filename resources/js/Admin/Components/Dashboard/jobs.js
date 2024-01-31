import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import Moment from 'moment';
import { Link } from "react-router-dom";
import axios from "axios";

export default function jobs() {

    const [jobs, setjobs] = useState([]);
    const [loading, setLoading] = useState('Loading...');
    const [pageCount, setPageCount] = useState(0);
    const [latestJobs,setlatestJobs] = useState([]);
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };

    const getDashboardJobs = (dur) => {
        axios
            .get('/api/admin/jobs?p=1&filter_week=' + dur, { headers })
            .then((response) => {
                if (response.data.jobs.data.length > 0) {
                setjobs(response.data.jobs.data);
                setPageCount(response.data.jobs.last_page);
            } else {
                setjobs([]);
                setLoading("No Job found");
                setPageCount(0);
            }
            })
    }

    const handlePageClick = async (data) => {
        let currentPage = data.selected + 1;
        axios
        .get("/api/admin/dashboard?p=1&page=" + currentPage, { headers })
            .then((response) => {
                if (response.data.jobs.data.length > 0) {
                    setjobs(response.data.jobs.data);
                    setPageCount(response.data.jobs.last_page);
                } else {
                    setLoading("No Job found");
                    setjobs([]);
                    setPageCount(0);
                }
            });
    };

    const handlePageClickToday = async (data) => {
        let currentPage = data.selected + 1;
        axios
            .get("/api/admin/jobs?p=1&page=" + currentPage+"&filter_week=today", { headers })
            .then((response) => {
                if (response.data.jobs.data.length > 0) {
                    setjobs(response.data.jobs.data);
                    setPageCount(response.data.jobs.last_page);
                } else {
                    setLoading("No Job found");
                    setjobs([]);
                    setPageCount(0);
                }
            });
    };

    const handlePageClickCurrent = async (data) => {
        let currentPage = data.selected + 1;
        axios
            .get("/api/admin/jobs?p=1&page=" + currentPage+"&filter_week=current", { headers })
            .then((response) => {
                if (response.data.jobs.data.length > 0) {
                    setjobs(response.data.jobs.data);
                    setPageCount(response.data.jobs.last_page);
                } else {
                    setLoading("No Job found");
                    setjobs([]);
                }
            });
    };

    const getCompleted = () => {
        axios
        .get(`/api/admin/dashboard`,{ headers })
        .then((response)=>{
           
            if (response.data.latest_jobs.data.length > 0) {
                setlatestJobs(response.data.latest_jobs.data);
                setPageCount(response.data.latest_jobs.last_page);
            } else {
                setLoading("No completed job found");
                setlatestJobs([]);
                setPageCount(0);
            }
        })
    }

    const copy = [...jobs];
    const [order,setOrder] = useState('ASC');
    const sortTable = (e,col) =>{
        
        let n = e.target.nodeName;
        if(n != "SELECT"){
        if (n == "TH") {
            let q = e.target.querySelector('span');
            if (q.innerHTML === "↑") {
                q.innerHTML = "↓";
            } else {
                q.innerHTML = "↑";
            }

        } else {
            let q = e.target;
            if (q.innerHTML === "↑") {
                q.innerHTML = "↓";
            } else {
                q.innerHTML = "↑";
            }
        }
    }
 
        if(order == 'ASC'){
            const sortData = [...copy].sort((a, b) => (a[col] < b[col] ? 1 : -1));
            setjobs(sortData);
            setOrder('DESC');
        }
        if(order == 'DESC'){
            const sortData = [...copy].sort((a, b) => (a[col] < b[col] ? -1 : 1));
            setjobs(sortData);
            setOrder('ASC');
        }
        
    }

    const copyc = [...latestJobs];
    const [corder,setcOrder] = useState('ASC');
    const sortTablec = (e,col) =>{
        
        let n = e.target.nodeName;
        if(n != "SELECT"){
        if (n == "TH") {
            let q = e.target.querySelector('span');
            if (q.innerHTML === "↑") {
                q.innerHTML = "↓";
            } else {
                q.innerHTML = "↑";
            }

        } else {
            let q = e.target;
            if (q.innerHTML === "↑") {
                q.innerHTML = "↓";
            } else {
                q.innerHTML = "↑";
            }
        }
    }
 
        if(orderc == 'ASC'){
            const sortData = [...copy].sort((a, b) => (a[col] < b[col] ? 1 : -1));
            setlatestJobs(sortData);
            setcOrder('DESC');
        }
        if(orderc == 'DESC'){
            const sortData = [...copy].sort((a, b) => (a[col] < b[col] ? -1 : 1));
            setlatestJobs(sortData);
            setcOrder('ASC');
        }
        
    }

    useEffect(() => {
        getDashboardJobs('today');
        getCompleted();
    }, []);

    return (
        <>
            <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item" role="presentation">
                    <a id="today-tab" onClick={(e) => { getDashboardJobs('today') }} className="nav-link active" data-toggle="tab" href="#tab-today" aria-selected="true" role="tab">Today</a>
                </li>
                <li className="nav-item" role="presentation">
                    <a id="week-tab" onClick={(e) => { getDashboardJobs('current') }} className="nav-link" data-toggle="tab" href="#tab-week" aria-selected="false" role="tab">This week</a>
                </li>
                <li className="nav-item" role="presentation">
                    <a id="completed-tab" onClick={getCompleted} className="nav-link" data-toggle="tab" href="#tab-completed" aria-selected="false" role="tab">Completed</a>
                </li>
            </ul>

            <div className="tab-content p-0">
                <div id="tab-today" className="tab-pane active show" role="tab-panel" aria-labelledby="today-tab">
                    <div className="boxPanel card rounded-0 mb-0">
                        <div className="table-responsive card-body">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th  onClick={(e)=>{sortTable(e,'start_date')}} style={{ "cursor": "pointer" }} >Job Date <span className="arr"> &darr; </span> </th>
                                        <th>Worker</th>
                                        <th>Client</th>
                                        <th>Service</th>
                                        <th  onClick={(e)=>{sortTable(e,'status')}} style={{ "cursor": "pointer" }} >Status <span className="arr"> &darr; </span> </th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        jobs && jobs.map((j) => {

                                            return (
                                                <tr>
                                                    <td>{Moment(j.start_date).format('DD,MMM Y')}</td>
                                                    <td>{(j.worker) ? j.worker.firstname + " " + j.worker.lastname : 'NA'}</td>
                                                    <td>{(j.client) ? j.client.firstname + " " + j.client.lastname : 'NA'}</td>
                                                    <td>
                                                        {

                                                            j.jobservice && j.jobservice.map((js, i) => {

                                                                return (
                                                                    ((j.client) &&  j.client.lng == 'en')
                                                                        ? (js.name + " ")
                                                                        :
                                                                        (js.heb_name + " ")
                                                                )
                                                            })



                                                        }
                                                    </td>
                                                    <td>{j.status}</td>
                                                    <td><Link to={`/admin/view-job/${j.id}`} className="btn btn-primary">View</Link></td>
                                                </tr>
                                            )
                                        })
                                    }

                                </tbody>
                            </table>
                            {jobs.length > 0 ? (
                                    <ReactPaginate
                                        previousLabel={"Previous"}
                                        nextLabel={"Next"}
                                        breakLabel={"..."}
                                        pageCount={pageCount}
                                        marginPagesDisplayed={2}
                                        pageRangeDisplayed={3}
                                        onPageChange={handlePageClickToday}
                                        containerClassName={
                                            "pagination justify-content-end mt-3"
                                        }
                                        pageClassName={"page-item"}
                                        pageLinkClassName={"page-link"}
                                        previousClassName={"page-item"}
                                        previousLinkClassName={"page-link"}
                                        nextClassName={"page-item"}
                                        nextLinkClassName={"page-link"}
                                        breakClassName={"page-item"}
                                        breakLinkClassName={"page-link"}
                                        activeClassName={"active"}
                                    />
                                ) : (
                                    <></>
                                )}
                        </div>
                      
                    </div>
                </div>
                <div id="tab-week" className="tab-pane" role="tab-panel" aria-labelledby="week-tab">
                    <div className="boxPanel card rounded-0 mb-0">
                        <div className="table-responsive card-body">
                            {
                                jobs.length > 0 ? 
                            
                            (
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th  onClick={(e)=>{sortTable(e,'start_date')}} style={{ "cursor": "pointer" }} >Job Date <span className="arr"> &darr; </span> </th>
                                        <th>Worker</th>
                                        <th>Client</th>
                                        <th>Service</th>
                                        <th  onClick={(e)=>{sortTable(e,'start_date')}} style={{ "cursor": "pointer" }} >Status <span className="arr"> &darr; </span> </th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                        jobs && jobs.map((j) => {

                                            return (
                                                <tr>
                                                    <td>{Moment(j.start_date).format('DD,MMM Y')}</td>
                                                    <td>{(j.worker) ? j.worker.firstname + " " + j.worker.lastname : 'NA'}</td>
                                                    <td>{(j.client) ? j.client.firstname + " " + j.client.lastname : 'NA'}</td>
                                                    <td>
                                                        {

                                                            j.jobservice && j.jobservice.map((js, i) => {

                                                                return (
                                                                    ((j.client) && j.client.lng == 'en')
                                                                        ? (js.name + " ")
                                                                        :
                                                                        (js.heb_name + " ")
                                                                )
                                                            })



                                                        }
                                                    </td>
                                                    <td>{j.status}</td>
                                                    <td><Link to={`/admin/view-job/${j.id}`} className="btn btn-primary">View</Link></td>
                                                </tr>
                                            )
                                        })
                                    }

                                </tbody>
                            </table>)
                            :(
                              <div class="form-control"> { loading } </div>
                            )
                          }
                           {jobs.length > 0 ? (
                                    <ReactPaginate
                                        previousLabel={"Previous"}
                                        nextLabel={"Next"}
                                        breakLabel={"..."}
                                        pageCount={pageCount}
                                        marginPagesDisplayed={2}
                                        pageRangeDisplayed={3}
                                        onPageChange={handlePageClickCurrent}
                                        containerClassName={
                                            "pagination justify-content-end mt-3"
                                        }
                                        pageClassName={"page-item"}
                                        pageLinkClassName={"page-link"}
                                        previousClassName={"page-item"}
                                        previousLinkClassName={"page-link"}
                                        nextClassName={"page-item"}
                                        nextLinkClassName={"page-link"}
                                        breakClassName={"page-item"}
                                        breakLinkClassName={"page-link"}
                                        activeClassName={"active"}
                                    />
                                ) : (
                                    <></>
                                )}
                           
                        </div>
                       
                    </div>
                </div>
                <div id="tab-completed" className="tab-pane" role="tab-panel" aria-labelledby="completed-tab">
                    <div className="boxPanel card rounded-0 mb-0">
                        <div className="table-responsive card-body">
                            {latestJobs.length > 0 ? (
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Client Name</th>
                                            <th>Service Name</th>
                                            <th style={{ cursor: 'pointer' }} onClick={e => sortTablec('date')}> Date <span className="arr"> &darr; </span> </th>
                                            <th style={{ cursor: 'pointer' }} onClick={e => sortTablec('shift')}> Shift <span className="arr"> &darr; </span> </th>
                                            <th>Assigned Worker</th>
                                            <th style={{ cursor: 'pointer' }} onClick={e => sortTablec('sattus')}>Status <span className="arr"> &darr; </span> </th>
                                            <th style={{ cursor: 'pointer' }} onClick={e => sortTablec('total')}>Total <span className="arr"> &darr; </span> </th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {latestJobs &&
                                            latestJobs.map(
                                                (item, index) => {
                                                    let total = 0;
                                                    return (
                                                        <tr key={index} style={{ cursor: 'pointer' }} onClick={e => rowHandle(e, item.id)}>
                                                            <td>{
                                                                item.client
                                                                    ? item.client.firstname +
                                                                    " " + item.client.lastname
                                                                    : "NA"
                                                            }
                                                            </td>
                                                            <td>{
                                                                item.jobservice && item.jobservice.map((js, i) => {

                                                                    total += parseInt(js.total);
                                                                    return (
                                                                        (item.client.lng == 'en')
                                                                            ? (js.name + " ")
                                                                            :
                                                                            (js.heb_name + " ")
                                                                    )
                                                                })

                                                            }</td>
                                                            <td>
                                                                {item.start_date}
                                                            </td>
                                                            <td>
                                                                {item.shifts}
                                                            </td>
                                                            <td>{
                                                                item.worker
                                                                    ? item.worker.firstname +
                                                                    " " + item.worker.lastname
                                                                    : "NA"
                                                            }</td>

                                                            <td
                                                                style={{
                                                                    textTransform:
                                                                        "capitalize",
                                                                }}
                                                            >
                                                                {item.status}
                                                            </td>
                                                            <td>
                                                                {total} ILS
                                                            </td>
                                                            <td>
                                                                <div className="d-flex">
                                                                    <Link
                                                                        to={`/admin/edit-job/${item.id}`}
                                                                        className="btn bg-purple d-none"
                                                                    >
                                                                        <i className="fa fa-edit"></i>
                                                                    </Link>
                                                                    <Link
                                                                        to={`/admin/view-job/${item.id}`}
                                                                        className="ml-2 btn bg-yellow"
                                                                    >
                                                                        <i className="fa fa-eye"></i>
                                                                    </Link>


                                                                    <button
                                                                        className="ml-2 btn bg-red"
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                item.id
                                                                            )
                                                                        }
                                                                    >
                                                                        <i className="fa fa-trash"></i>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                            )}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-center mt-5">
                                    {loading}
                                </p>
                            )}
                        </div>
                        {latestJobs.length > 0 ? (
                                    <ReactPaginate
                                        previousLabel={"Previous"}
                                        nextLabel={"Next"}
                                        breakLabel={"..."}
                                        pageCount={pageCount}
                                        marginPagesDisplayed={2}
                                        pageRangeDisplayed={3}
                                        onPageChange={handlePageClick}
                                        containerClassName={
                                            "pagination justify-content-end mt-3"
                                        }
                                        pageClassName={"page-item"}
                                        pageLinkClassName={"page-link"}
                                        previousClassName={"page-item"}
                                        previousLinkClassName={"page-link"}
                                        nextClassName={"page-item"}
                                        nextLinkClassName={"page-link"}
                                        breakClassName={"page-item"}
                                        breakLinkClassName={"page-link"}
                                        activeClassName={"active"}
                                    />
                                ) : (
                                    <></>
                                )}
                    </div>
                </div>
            </div>
        </>
    )
}
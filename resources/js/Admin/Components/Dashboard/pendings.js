import axios from "axios";
import React, { useState, useEffect } from "react";
import Moment from 'moment';
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";

export default function () {

    const [data, setData] = useState([]);
    const [pageCount,setPageCount] = useState(0);
    const [NpageCount,setNPageCount] = useState(0);
    const [notices,setNotices] = useState([]);
    const [loading,setLoading] = useState("Loading...");
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };

    const getData = (f) => {
        axios
            .get(`/api/admin/pending-data/${f}`, { headers })
            .then((res) => {
               
                if(res.data.data.data.length > 0){
                    setData(res.data.data.data);
                    setPageCount(res.data.data.last_page);
                } else{
                    setData([]);
                    setLoading('No Record Found');
                }
            })
    }

    const headNotice = () => {
        axios.post('/api/admin/notice', { all: 1 }, { headers })
            .then((res) => {
                if (res.data.notice.data) {
                    setNotices(res.data.notice.data);
                    setNPageCount(res.data.notice.last_page);
                } else {
                    setNotices([]);
                    setLoading('No notification yet');
                }
            })
    }

    const handlePageClick = async (data) => {
        let currentPage = data.selected + 1;
        axios
            .post("/api/admin/notice?page=" + currentPage, { all: 1 }, { headers })
            .then((response) => {
                if (response.data.notice.data) {
                    setNotices(response.data.notice.data);
                    setNPageCount(response.data.notice.last_page);
                } else {
                    setLoading('No notification yet');
                    setNotices([]);
                }
            });
    };

    const MhandleDataClick = async (data) => {
     
        let currentPage = data.selected + 1;
        axios
            .get(`/api/admin/pending-data/meetings?page=` + currentPage, { headers })
            .then((response) => {
                if (response.data.data.data.length > 0 ) {
                    setData(response.data.data.data);
                    setPageCount(response.data.data.last_page);
                } else {
                    setLoading('No Meetings');
                    setData([]);
                }
            });
    };
    const ChandleDataClick = async (data) => {
      
        let currentPage = data.selected + 1;
        axios
            .get(`/api/admin/pending-data/contracts?page=` + currentPage, { headers })
            .then((response) => {
                if (response.data.data.data.length > 0 ) {
                    setData(response.data.data.data);
                    setPageCount(response.data.data.last_page);
                } else {
                    setLoading('No Contracts');
                    setData([]);
                }
            });
    };

    const OhandleDataClick = async (data) => {
       
        let currentPage = data.selected + 1;
        axios
            .get(`/api/admin/pending-data/offers?page=` + currentPage, { headers })
            .then((response) => {
                if (response.data.data.data.length > 0 ) {
                    setData(response.data.data.data);
                    setPageCount(response.data.data.last_page);
                } else {
                    setLoading('No Offers');
                    setData([]);
                }
            });
    };

    const copy = [...data];
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
            setData(sortData);
            setOrder('DESC');
        }
        if(order == 'DESC'){
            const sortData = [...copy].sort((a, b) => (a[col] < b[col] ? -1 : 1));
            setData(sortData);
            setOrder('ASC');
        }
        
    }




    useEffect(() => {
         getData('meetings');
         headNotice();
    }, []);
    return (
        <>
            <ul className="nav nav-tabs mt-4" role="tablist">
                <li className="nav-item" role="presentation">
                    <a id="pmeeting-tab" onClick={e => getData('meetings')} className="nav-link active" data-toggle="tab" href="#tab-pmeeting" aria-selected="true" role="tab">Pending Meetings</a>
                </li>
                <li className="nav-item" role="presentation">
                    <a id="pcontract-tab" onClick={e => getData('contracts')} className="nav-link" data-toggle="tab" href="#tab-pcontract" aria-selected="false" role="tab">Pending Contracts</a>
                </li>
                <li className="nav-item" role="presentation">
                    <a id="poffer-tab" onClick={e => getData('offers')} className="nav-link" data-toggle="tab" href="#tab-poffer" aria-selected="false" role="tab">Pending Offers</a>
                </li>
                <li className="nav-item" role="presentation">
                    <a id="lnotification-tab" onClick={e => headNotice} className="nav-link" data-toggle="tab" href="#tab-lnotification" aria-selected="false" role="tab">Notifications</a>
                </li>
            </ul>
            <div className="tab-content p-0">
                <div id="tab-pmeeting" className="tab-pane active show" role="tab-panel" aria-labelledby="pmeeting-tab">
                    <div className="boxPanel card rounded-0 mb-0">
                        <div className="table-responsive card-body">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th style={{cursor:"pointer"}} onClick={(e)=>{sortTable(e,'id')}} >ID <span className='arr'> &darr; </span></th>
                                        <th>Client</th>
                                        <th>Contact</th>
                                        <th>Address</th>
                                        <th>Meeting Attender</th>
                                        <th style={{cursor:"pointer"}} onClick={(e)=>{sortTable(e,'start_date')}}>Scheduled <span className='arr'> &darr; </span></th>
                                        <th style={{cursor:"pointer"}} onClick={(e)=>{sortTable(e,'booking_status')}}>Booking Status <span className='arr'> &darr; </span></th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data && data.map((d, i) => {
                                            let cords = (d.client.latitude && d.client.longitude)
                                            ? (d.client.latitude +","+ d.client.longitude):"";
                                            let phone = (d.client.phone != undefined) ? d.client.phone.split(',') : [];
                                            return (
                                                <tr>
                                                    <td>#{d.id}</td>
                                                    <td>{(d.client) ? d.client.firstname + " " + d.client.lastname : "NA"}</td>
                                                    <td>
                                                        {
                                                            phone && phone.map((p, i) => {
                                                                return (
                                                                    (phone.length > 1) ?
                                                                        <a href={`tel:${p}`}>{p} | </a>
                                                                        : <a href={`tel:${p}`}>{p} </a>
                                                                )
                                                            })
                                                        }
                                                    </td>
                                                    <td><Link to={`https://maps.google.com?q=${cords}`}>{d.client.geo_address}</Link></td>
                                                    <td>
                                                        {
                                                            d.team
                                                                ? d.team.name
                                                                : "NA"
                                                        }
                                                    </td>
                                                    <td>
                                                        <span style={{ color: "blue" }}>{Moment(d.start_date).format('DD/MM/Y') + '\n'}</span>
                                                        <br />
                                                        <span style={{ color: "blue" }}>{Moment(d.start_date).format('dddd')}</span>
                                                        <br />
                                                        <span style={{ color: "green" }}>{"Start :" + d.start_time}</span>
                                                        <br />
                                                        <span style={{ color: "red" }}>{"End   :" + d.end_time}</span>
                                                    </td>
                                                    <td style={{ color: "purple" }}>{d.booking_status}</td>
                                                    <td><Link to={`/admin/view-schedule/${d.client.id}?sid=${d.id}`} className="btn btn-primary">View</Link></td>
                                                </tr>
                                            )
                                        })
                                    }

                                </tbody>
                            </table>
                            {data.length > 0 ? (
                                <ReactPaginate
                                    previousLabel={"Previous"}
                                    nextLabel={"Next"}
                                    breakLabel={"..."}
                                    pageCount={pageCount}
                                    marginPagesDisplayed={2}
                                    pageRangeDisplayed={3}
                                    onPageChange={MhandleDataClick}
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
                                )
                            }
                        </div>
                    </div>
                </div>
                <div id="tab-pcontract" className="tab-pane" role="tab-panel" aria-labelledby="pcontract-tab">
                    <div className="boxPanel card rounded-0 mb-0">
                        <div className="table-responsive card-body">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Client</th>
                                        <th>Email</th>
                                        <th>Address</th>
                                        <th>Contact</th>
                                        <th>Service</th>
                                        <th>Total</th>
                                        <th style={{cursor:"pointer"}} onClick={(e)=>{sortTable(e,'status')}}>Status <span className='arr'> &darr; </span></th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        data && data.map((d,i)=>{

                                            let cords = (d.client.latitude && d.client.longitude)
                                            ? (d.client.latitude +","+ d.client.longitude):"";
                                            let phone = (d.client.phone != undefined) ? d.client.phone.split(',') : [];
                                            let services = ( (d.offer) ) ? JSON.parse(d.offer.services) : [];
                                          
                                            return(
                                               
                                                <tr>
                                                <td>{(d.client) ? d.client.firstname + " " + d.client.lastname : "NA"}</td>
                                                <td>{(d.client) ? d.client.email : "NA"}</td>
                                                <td><Link to={`https://maps.google.com?q=${cords}`}>{d.client.geo_address}</Link></td>
                                                <td>
                                                        {
                                                            phone && phone.map((p, i) => {
                                                                return (
                                                                    (phone.length > 1) ?
                                                                        <a href={`tel:${p}`}>{p} | </a>
                                                                        : <a href={`tel:${p}`}>{p} </a>
                                                                )
                                                            })
                                                        }
                                                </td>
                                                <td>
                                                {services && services.map((s, j) => {
                                                             
                                                               return (
                                                                   (services.length - 1 != j) ?
                                                                   s.service == '10' ? s.other_title+" | ":
                                                                       s.name + " | "
                                                                       : s.name
                                                               )
                                                })}
                                                </td>
                                                <td>{(d.offer) ? d.offer.total + " ILS +VAT" : 0} </td>
                                                <td style={{ color: "purple" }}>{ d.status }</td>
                                                
                                                <td> <Link to={`/admin/view-contract/${d.id}`} className="btn btn-primary">View</Link></td>
                                            </tr>

                                            )
                                        })
                                    }
                                   
                                </tbody>
                            </table>
                            {data.length > 0 ? (
                                <ReactPaginate
                                    previousLabel={"Previous"}
                                    nextLabel={"Next"}
                                    breakLabel={"..."}
                                    pageCount={NpageCount}
                                    marginPagesDisplayed={2}
                                    pageRangeDisplayed={3}
                                    onPageChange={ChandleDataClick}
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
                                <></>)
                            }
                        </div>
                    </div>
                </div>
                <div id="tab-poffer" className="tab-pane" role="tab-panel" aria-labelledby="poffer-tab">
                    <div className="boxPanel card rounded-0 mb-0">
                        <div className="table-responsive card-body">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Client</th>
                                        <th>Email</th>
                                        <th>Address</th>
                                        <th>Phone</th>
                                        <th style={{cursor:"pointer"}} onClick={(e)=>{sortTable(e,'status')}}>Status <span className='arr'> &darr; </span></th>
                                        <th style={{cursor:"pointer"}} onClick={(e)=>{sortTable(e,'total')}}>Total <span className='arr'> &darr; </span></th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {
                                        data && data.map((d,i)=>{

                                            let cords = (d.client.latitude && d.client.longitude)
                                            ? (d.client.latitude +","+ d.client.longitude):"";
                                            let phone = (d.client.phone != undefined) ? d.client.phone.split(',') : [];
                                            let services = ( (d.offer) ) ? JSON.parse(d.offer.services) : [];
                                            return(
                                               
                                                <tr>
                                                <td>{(d.client) ? d.client.firstname + " " + d.client.lastname : "NA"}</td>
                                                <td>{(d.client) ? d.client.email : "NA"}</td>
                                                <td><Link to={`https://maps.google.com?q=${cords}`}>{d.client.geo_address}</Link></td>
                                                <td>
                                                        {
                                                            phone && phone.map((p, i) => {
                                                                return (
                                                                    (phone.length > 1) ?
                                                                        <a href={`tel:${p}`}>{p} | </a>
                                                                        : <a href={`tel:${p}`}>{p} </a>
                                                                )
                                                            })
                                                        }
                                                </td>
                                                <td style={{ color: "purple" }}>{ d.status }</td>
                                                <td>{d.total} ILS + VAT</td>
                                              
                                                <td> <Link to={`/admin/view-offer/${d.id}`} className="btn btn-primary">View</Link></td>
                                            </tr>

                                            )
                                        })
                                    }
                                  
                                </tbody>
                            </table>
                            {data.length > 0 ? (
                                <ReactPaginate
                                    previousLabel={"Previous"}
                                    nextLabel={"Next"}
                                    breakLabel={"..."}
                                    pageCount={pageCount}
                                    marginPagesDisplayed={2}
                                    pageRangeDisplayed={3}
                                    onPageChange={OhandleDataClick}
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
                <div id="tab-lnotification" className="tab-pane" role="tab-panel" aria-labelledby="lnotification-tab">
                    <div className="boxPanel card rounded-0 mb-0 p-4">
                       
                            {notices.length > 0 ? (

                                notices && notices.map((n, i) => {
                                    return (

                                        <div className="agg-list">
                                            <div className="icons"><i className="fas fa-check-circle"></i></div>
                                            <div className="agg-text">
                                                <h6 dangerouslySetInnerHTML={{ __html: n.data }} />
                                                <p>{Moment(n.created_at).format('DD MMM Y, HH:MM A')}</p>
                                            </div>
                                        </div>

                                    )
                                })

                                )
                                :
                                (<div className='form-control text-center'>{loading}</div>)
                                }
                                 {notices.length > 0 ? (
                                <ReactPaginate
                                    previousLabel={"Previous"}
                                    nextLabel={"Next"}
                                    breakLabel={"..."}
                                    pageCount={NpageCount}
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
import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
import Moment from 'moment';
import ReactPaginate from "react-paginate";
import { RotatingLines } from 'react-loader-spinner'
import { useAlert } from 'react-alert';

export default function Jobs() {

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState("Loading...");
    const [jres, setJres] = useState('');

    const [filtered, setFiltered] = useState('');
    const [pageCount, setPageCount] = useState(0);
    const params = useParams();
    const [wait, setWait] = useState(true);
    const alert = useAlert();
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };

    const getJobs = (filter) => {
        axios
            .post(`/api/admin/get-client-jobs?` + filter, { cid: params.id }, { headers })
            .then((res) => {

                setWait(true);
                setJres(res.data);
                if (res.data.jobs.data.length > 0) {

                    setJobs(res.data.jobs.data);
                    setWait(false);
                    setPageCount(res.data.jobs.last_page);
                }
                else {
                    setJobs([]);
                    setWait(false);
                    setLoading('No job found');
                }
            });
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
                            getJobs();
                        }, 1000);
                    });
            }
        });
    };

    const handlePageClick = async (data) => {
        let currentPage = data.selected + 1;
        axios
            .post(`/api/admin/get-client-jobs?` + filtered + "&page=" + currentPage, { cid: params.id }, { headers })
            .then((response) => {
                console.log(response);
                if (response.data.jobs.data.length > 0) {
                    setJobs(response.data.jobs.data);
                    setPageCount(response.data.jobs.last_page);
                } else {
                    setJobs([]);
                    setLoading("No Job Found");
                }
            });
    };


    useEffect(() => {
        setFiltered('f=all');
        getJobs('f=all');
    }, []);

    const copy = [...jobs];
    const [order, setOrder] = useState('ASC');
    const sortTable = (e, col) => {

        let n = e.target.nodeName;

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

        if (order == 'ASC') {
            const sortData = [...copy].sort((a, b) => (a[col] < b[col] ? 1 : -1));
            setJobs(sortData);
            setOrder('DESC');
        }
        if (order == 'DESC') {
            const sortData = [...copy].sort((a, b) => (a[col] < b[col] ? -1 : 1));
            setJobs(sortData);
            setOrder('ASC');
        }

    }

    
    const checkAllBox = (e) => {

        let cb = document.querySelectorAll('.cb');

        if (e.target.checked) {

            cb.forEach((c,i)=>{
                c.checked = true;
            });
            
        } else {
            cb.forEach((c,i)=>{
                c.checked = false;
            });
        }
    }

    const genOrder = () =>{
        
        let cb = document.querySelectorAll('.cb');
        let ar = [];
        cb.forEach((c,i)=>{
            if(c.checked == true){
              ar.push(c.value);
            }
        });
        if(ar.length == 0){ alert.error('Please check job'); return; }
        
        axios
        .post(`/api/admin/multiple-orders`,{ar},{ headers })
        .then((res)=>{
            getJobs(filtered);
            alert.success('Job Order(s) created successfully');

        });
    }

    const genInvoice = () =>{
        
        let cb = document.querySelectorAll('.cb');
        let ar = [];
        cb.forEach((c,i)=>{
            if(c.checked == true){
            let id = c.getAttribute('oid');
            if(id != '')
              ar.push(id);
            }
        });
        if(ar.length == 0){ alert.error('Please check job'); return; }
       
        axios
        .post(`/api/admin/multiple-invoices`,{ar},{ headers })
        .then((res)=>{
            getJobs(filtered);
            alert.success('Job Invoice(s) created successfully');

        });
    }

    return (
        <div className="boxPanel">
            <div className="action-dropdown dropdown order_drop text-right mb-3">
            <button className="btn btn-pink mr-3" onClick={e=>genOrder(e)} >Generate Orders</button>
            <button className="btn btn-primary mr-3 ml-3" onClick={e=>genInvoice(e)} >Generate Invoice</button>
                <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown">
                    <i className="fa fa-filter"></i>
                </button>
                <div className="dropdown-menu">
                    <button className="dropdown-item" onClick={e => { setFiltered('f=all'); getJobs('f=all') }}                               >All              - {jres.all}</button>
                    <button className="dropdown-item" onClick={e => { setFiltered('status=scheduled'); getJobs('status=scheduled') }}         >Scheduled        - {jres.scheduled}</button>
                    <button className="dropdown-item" onClick={e => { setFiltered('status=unscheduled'); getJobs('status=unscheduled') }}     >Unscheduled      - {jres.unscheduled}</button>
                    <button className="dropdown-item" onClick={e => { setFiltered('status=progress'); getJobs('status=progress') }}           >Progress         - {jres.progress}</button>
                    <button className="dropdown-item" onClick={e => { setFiltered('status=completed'); getJobs('status=completed') }}         >completed        - {jres.completed}</button>
                    <button className="dropdown-item" onClick={e => { setFiltered('status=canceled'); getJobs('status=canceled') }}           >Canceled         - {jres.canceled}</button>
                    <button className="dropdown-item" onClick={e => { setFiltered('q=ordered'); getJobs('q=ordered') }}                       >Ordered          - {jres.ordered}</button>
                    <button className="dropdown-item" onClick={e => { setFiltered('q=unordered'); getJobs('q=unordered') }}                   >unordered        - {jres.unordered}</button>
                    <button className="dropdown-item" onClick={e => { setFiltered('q=invoiced'); getJobs('q=invoiced') }}                     >Invoiced         - {jres.invoiced}</button>
                    <button className="dropdown-item" onClick={e => { setFiltered('q=uninvoiced'); getJobs('q=uninvoiced') }}                 >UnInvoiced       - {jres.uninvoiced}</button>
                </div>
            </div>
            <div className="table-responsive text-center">

                <RotatingLines
                    strokeColor="grey"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="96"
                    visible={wait}
                />

                {wait == false && jobs.length > 0 ? (
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th><input type="checkbox" name="cbh" onClick={e => checkAllBox(e)} className='form-control cbh' /></th>
                                <th onClick={(e) => sortTable(e, 'id')} style={{ cursor: 'pointer' }}>ID <span className='arr'> &darr; </span></th>
                                <th>Service Name</th>
                                <th>Worker Name</th>
                                <th>Total Price</th>
                                <th onClick={(e) => sortTable(e, 'created_at')} style={{ cursor: 'pointer' }}>Start Date <span className='arr'> &darr; </span></th>
                                <th onClick={(e) => sortTable(e, 'status')} style={{ cursor: 'pointer' }}>Status <span className='arr'> &darr; </span></th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>

                            {jobs && jobs.map((j, i) => {

                                // let services = (j.offer.services) ? JSON.parse(j.offer.services) : [];
                                let total = 0;
                                let pstatus = null;

                                return (
                                    <tr>
                                        <td><input type="checkbox" name="cb" value={j.id} oid={j.order.length > 0 ? j.order[0].id : ''} className='form-control cb' /></td>
                                        <td>#{j.id}</td>
                                        <td>
                                            {

                                                j.jobservice && j.jobservice.map((js, i) => {

                                                    total += parseInt(js.total);
                                                    return (js.name) ? js.name + " " : 'NA'
                                                })
                                            }

                                        </td>
                                        <td>{
                                            j.worker
                                                ? j.worker.firstname
                                                + " " + j.worker.lastname
                                                : "NA"
                                        }</td>
                                        <td> {total} ILS + VAT</td>
                                        <td>{Moment(j.start_date).format('DD MMM,Y')}</td>
                                        <td>{j.status}


                                            {
                                                j.order && j.order.map((o, i) => {

                                                    return (<> <br /><Link target='_blank' to={o.doc_url} className="jorder"> order -{o.order_id} </Link><br /></>);
                                                })
                                            }

                                            {
                                                j.invoice && j.invoice.map((inv, i) => {

                                                    if (i == 0) { pstatus = inv.status; }

                                                    console.log(pstatus);

                                                    return (<> <br /><Link target='_blank' to={inv.doc_url} className="jinv"> Invoice -{inv.invoice_id} </Link><br /></>);
                                                })
                                            }

                                            {
                                                pstatus != null && <> <br /><span class='jorder'>{pstatus}</span><br /></>
                                            }
                                        </td>
                                        <td className='text-center'>

                                            <div className="action-dropdown dropdown pb-2">
                                                <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown">
                                                    <i className="fa fa-ellipsis-vertical"></i>
                                                </button>

                                                <div className="dropdown-menu">
                                                    {(!j.worker) &&
                                                        <Link to={`/admin/create-job/${j.contract_id}`} className="dropdown-item" >Create Job</Link>
                                                    }
                                                    <Link to={`/admin/view-job/${j.id}`} className="dropdown-item" >View Job</Link>

                                                    <Link to={`/admin/add-order/?j=${j.id}&c=${params.id}`} className="dropdown-item" >Create Order</Link>
                                                    <Link to={`/admin/add-invoice/?j=${j.id}&c=${params.id}`} className="dropdown-item" >Create Invoice</Link>

                                                    <button className="dropdown-item" onClick={() => handleDelete(j.id)}>Delete</button>
                                                </div>
                                            </div>

                                        </td>
                                    </tr>
                                )
                            })}

                        </tbody>
                    </table>
                )
                    :
                    (
                        <div className='form-control text-center'>{loading}</div>
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
                ) : ''}
            </div>
        </div>
    )
}

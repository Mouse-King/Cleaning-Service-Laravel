import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import Sidebar from '../../Layouts/Sidebar';
import axios from 'axios';
import Swal from 'sweetalert2';
import ReactPaginate from "react-paginate";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import { useNavigate } from 'react-router-dom';

export default function Contract() {

    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState("Loading...");
    const [pageCount, setPageCount] = useState(0);
    const [filter,setFilter] = useState('');
    const navigate = useNavigate();
    
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Delete Contract!",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`/api/admin/contract/${id}`, { headers })
                    .then((response) => {
                        Swal.fire(
                            "Deleted!",
                            "Contract has been deleted.",
                            "success"
                        );
                        setTimeout(() => {
                            window.location.reload(true);
                        }, 1000);
                    });
            }
        });
    };

    const handlePageClick = async (data) => {
        let currentPage = data.selected + 1;
        axios
            .get("/api/admin/contract?page=" + currentPage+"&q="+filter, { headers })
            .then((response) => {
                if (response.data.contracts.data.length > 0) {
                    setContracts(response.data.contracts.data);
                    setPageCount(response.data.contracts.last_page);
                } else {
                    setLoading("No contract found");
                }
            });
    };

    const filterContracts = (e) => {
        axios
            .get(`/api/admin/contract?q=${e.target.value}`, { headers })
            .then((response) => {
                if (response.data.contracts.data.length > 0) {
                    setContracts(response.data.contracts.data);
                    setPageCount(response.data.contracts.last_page);
                } else {
                    setContracts([]);
                    setPageCount(response.data.contracts.last_page);
                    setLoading("No contract found");
                }
            });
    }


    const getContract = () => {
        axios
            .get(`/api/admin/contract`, { headers })
            .then((res) => {
                if (res.data.contracts.data.length > 0) {
                    setContracts(res.data.contracts.data);
                    setPageCount(res.data.contracts.last_page);
                } else {
                    setLoading("No contract found");
                }

            })
    }
    useEffect(() => {
        getContract();
    }, []);

    const handleNavigate = (e, id) => {
        e.preventDefault();
        navigate(`/admin/view-contract/${id}`);
    }
    
    const copy = [...contracts];
    const [order, setOrder] = useState('ASC');
    const sortTable = (e,col) => {
        
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


        if (order == 'ASC') {
            const sortData = [...copy].sort((a, b) => (a[col] < b[col] ? 1 : -1));
            setContracts(sortData);
            setOrder('DESC');
        }
        if (order == 'DESC') {
            const sortData = [...copy].sort((a, b) => (a[col] < b[col] ? -1 : 1));
            setContracts(sortData);
            setOrder('ASC');
        }

    }

    const cancelJob = (e,id,job) => {
        e.preventDefault();
        let stext = (job == 'disable') ? 'Yes, Cancel Jobs' : 'Yes, Resume Jobs'
        Swal.fire({
            title: 'Are you sure ?',
            text: '',
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: 'Cancel',
            confirmButtonText: stext,
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .post(`/api/admin/cancel-contract-jobs`, { id, job }, { headers })
                    .then((response) => {
                        Swal.fire(
                            response.data.msg,
                            '',
                            "success"
                        );
                        setTimeout(() => {
                            getContract();
                        }, 1000);
                    });
            }
        });

    }

    return (
        <div id="container">
            <Sidebar />
            <div id="content">
                <div className="titleBox customer-title">
                    <div className="row">
                        <div className="col-sm-6">
                            <h1 className="page-title">Contracts</h1>
                        </div>
                        <div className="col-sm-6">
                            <div className="search-data">
                                <input type='text' className="mr-0 form-control" onChange={(e)=>{filterContracts(e);setFilter(e.target.value)}} placeholder="Search" />
                            </div>
                        </div>
                        <div className='col-sm-6 hidden-xl mt-4'>
                          <select className='form-control' onChange={e => sortTable(e,e.target.value)}>
                          <option selected>-- Sort By--</option>
                           <option value="status">Status</option>
                          </select>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <div className="boxPanel">
                            <div className="table-responsive">
                                {contracts.length > 0 ? (
                                    <Table className="table table-bordered">
                                        <Thead>
                                            <Tr>
                                                <Th scope="col">Client</Th>
                                                <Th scope="col">Email</Th>
                                                <Th scope="col" style={{ width: "16%" }}>Address</Th>
                                                <Th scope="col">Phone</Th>
                                                <Th scope="col">Service Name</Th>
                                                <Th style={{cursor:'pointer'}} onClick={(e)=>sortTable(e,'status')} scope="col">Status <span className='arr'> &darr; </span></Th>
                                                <Th scope="col">Total</Th>
                                                <Th scope="col">Job Status</Th>
                                                <Th scope="col">Action</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {contracts && contracts.map((c, i) => {

                                            if(c.client){
                                                let address = (c.client.geo_address) ? c.client.geo_address : 'NA';
                                                let cords = (c.client.latitude && c.client.longitude)
                                                            ? (c.client.latitude +","+ c.client.longitude):"";
                                              
                                                let services = ( (c.offer) ) ? JSON.parse(c.offer.services) : [];
                                                //let services = [];
                                                let color =  "";         
                                                if(c.status == 'un-verified' || c.status == 'not-signed') { color = 'purple' }
                                                else if(c.status == 'verified') { color =  'green'}
                                                else {color = 'red'}
                                                
                                                let phone = (c.client.phone != undefined) ? c.client.phone.split(',') : [];

                                                return (

                                                    <Tr style={{"cursor":"pointer"}}>
                                                        <Td><Link to={`/admin/view-client/${c.client.id}`}>
                                                            {
                                                                c.client
                                                                    ? c.client.firstname + " " + c.client.lastname
                                                                    : ''
                                                            }
                                                        </Link></Td>
                                                        <Td onClick={(e)=>handleNavigate(e,c.id)}>{c.client.email}</Td>
                                                        <Td><Link to={`https://maps.google.com?q=${cords}`}>

                                                            {address}

                                                        </Link></Td>
                                                        <Td>
                                                                {
                                                                    phone && phone.map((p,i)=>{
                                                                        return(
                                                                            (phone.length > 1)?
                                                                            <a href={`tel:${p}`}>{ p } | </a>
                                                                            : <a href={`tel:${p}`}>{ p } </a>
                                                                        )
                                                                    })
                                                                }
                                                             </Td>
                                                       
                                                        <Td onClick={(e)=>handleNavigate(e,c.id)}>
                                                            {services && services.map((s, j) => {
                                                               
                                                                return (
                                                                    (services.length - 1 != j) ?
                                                                    s.service == '10' ? s.other_title+" | ":
                                                                        s.name + " | "
                                                                        : s.name
                                                                )
                                                            })}
                                                        </Td>
                                                        <Td style={{color}} onClick={(e)=>handleNavigate(e,c.id)}>{c.status}</Td>
                                                        <Td onClick={(e)=>handleNavigate(e,c.id)}>{c.offer ? c.offer.total+" ILS + VAT" : 'NA'} </Td>
                                                        <Td onClick={(e)=>handleNavigate(e,c.id)}>{(c.job_status) ? 'Active' : 'InActive'}</Td>
                                                        <Td>
                                                            <div className="action-dropdown dropdown">
                                                                <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown">
                                                                    <i className="fa fa-ellipsis-vertical"></i>
                                                                </button>
                                                                <div className="dropdown-menu">
                                                                    { (c.status == 'verified') &&
                                                                    <Link to={`/admin/create-job/${c.id}`} className="dropdown-item">Create Job</Link>
                                                                    }
                                                                    { (c.job_status == 1 && c.status == 'verified') &&
                                                                    <Link onClick={(e)=>cancelJob(e,c.id,'disable')} className="dropdown-item">Cancel Job</Link>
                                                                    }
                                                                    { (c.job_status == 0 && c.status == 'verified') &&
                                                                    <Link onClick={(e)=>cancelJob(e,c.id,'enable')} className="dropdown-item">Resume Job</Link>
                                                                    }
                                                                    <Link to={`/admin/view-contract/${c.id}`} className="dropdown-item">View</Link>
                                                                    <button className="dropdown-item" onClick={() => handleDelete(c.id)}
                                                                    >Delete</button>
                                                                </div>
                                                            </div>
                                                        </Td>
                                                    </Tr>

                                                )
                                            }
                                            })}

                                        </Tbody>
                                    </Table>
                                ) : (
                                    <div className='form-control text-center'>{loading}</div>
                                )
                                }
                            </div>
                            {contracts.length > 0 ? (
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
                </div>

            </div>
        </div>
    );
}


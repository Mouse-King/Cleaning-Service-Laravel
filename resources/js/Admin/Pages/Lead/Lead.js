import React, { useState, useEffect } from "react";
import Sidebar from "../../Layouts/Sidebar";
import { Link } from "react-router-dom";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import { useNavigate } from "react-router-dom";
import { CSVLink } from "react-csv";

export default function Lead() {

    const [leads, setLeads] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [filter, setFilter] = useState('');
    const [condition, setCondition] = useState('');
    const [loading, setLoading] = useState("Loading...");

    const [stat, setStat] = useState(null);

    const navigate = useNavigate();
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };

    const getleads = () => {
        axios.get("/api/admin/leads", { headers }).then((response) => {

            if (response.data.leads.data.length > 0) {
                setLeads(response.data.leads.data);
                setPageCount(response.data.leads.last_page);
            } else {
                setLeads([]);
                setLoading("No lead found");
            }
        });
    };


    useEffect(() => {
        getleads();
    }, []);


    const filterLeads = (e) => {
        setFilter(e.target.value);
        setCondition('search');

        axios
            .get(`/api/admin/leads?q=${e.target.value}` + "&condition=search", { headers })
            .then((response) => {
                if (response.data.leads.data.length > 0) {
                    setLeads(response.data.leads.data);
                    setPageCount(response.data.leads.last_page);
                    setLoading("Loading...");
                } else {
                    setLeads([]);
                    setPageCount(response.data.leads.last_page);
                    setLoading("No lead found");
                }
            })
    }

    const filterLeadsStat = (s) => {

        setFilter(s);
        setCondition('filter');

        axios
            .get(`/api/admin/leads?q=${s}` + "&condition=filter", { headers })
            .then((response) => {
                if (response.data.leads.data.length > 0) {
                    setLeads(response.data.leads.data);
                    setPageCount(response.data.leads.last_page);
                    setLoading("Loading...");
                } else {
                    setLeads([]);
                    setPageCount(response.data.leads.last_page);
                    setLoading("No lead found");
                }
            })
    }

    const booknun = (s) => {

        setFilter(s);
        axios
            .get(`/api/admin/leads?action=${s}`, { headers })
            .then((response) => {
                if (response.data.leads.data.length > 0) {
                    setLeads(response.data.leads.data);
                    setPageCount(response.data.leads.last_page);
                } else {
                    setLeads([]);
                    setPageCount(response.data.leads.last_page);
                    setLoading("No lead found");
                }
            })

    }

    const handlePageClick = async (data) => {
        let currentPage = data.selected + 1;
        let cn = "&q=";

        axios
            .get("/api/admin/leads?page=" + currentPage + cn + filter + "&condition=" + condition, { headers })
            .then((response) => {
                if (response.data.leads.data.length > 0) {
                    setLeads(response.data.leads.data);
                    setPageCount(response.data.leads.last_page);
                } else {
                    setLeads([]);
                    setLoading("No lead found");
                }
            });
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Delete Lead!",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`/api/admin/leads/${id}`, { headers })
                    .then((response) => {
                        Swal.fire(
                            "Deleted!",
                            "Lead has been deleted.",
                            "success"
                        );
                        setTimeout(() => {
                            getleads();
                        }, 1000);
                    });
            }
        });
    };

    const unintrested = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Mark Uninterested",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .post(`/api/admin/uninterested/${id}`, { id },{ headers })
                    .then((response) => {
                        Swal.fire(
                            "Marked!",
                            "Lead Marked Unintrested",
                            "success"
                        );
                        setTimeout(() => {
                            getleads();
                        }, 1000);
                    });
            }
        });
    };


    const handleNavigate = (e, id) => {
        e.preventDefault();
        navigate(`/admin/view-lead/${id}`);
    }

    const copy = [...leads];
    const [order, setOrder] = useState('ASC');
    const sortTable = (e, col) => {

        let n = e.target.nodeName;
        if (n != "SELECT") {
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
            setLeads(sortData);
            setOrder('DESC');
        }
        if (order == 'DESC') {
            const sortData = [...copy].sort((a, b) => (a[col] < b[col] ? -1 : 1));
            setLeads(sortData);
            setOrder('ASC');
        }

    }
    return (
        <div id="container">
            <Sidebar />
            <div id="content">
                <div className="titleBox customer-title">
                    <div className="row">
                        <div className="col-sm-6">
                            <h1 className="page-title">Leads</h1>
                        </div>



                        <div className="col-sm-6">
                            <div className="search-data">

                                <div className="action-dropdown dropdown mt-4 mr-2">
                                    <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown">
                                        <i className="fa fa-filter"></i>
                                    </button>
                                    <div className="dropdown-menu">
                                        <button className="dropdown-item" onClick={(e) => { setStat('all'); setCondition('filter'); setFilter('all'); getleads() }}>All</button>
                                        <button className="dropdown-item" onClick={(e) => { setStat('0'); setCondition('filter'); filterLeadsStat('0'); }}>Leads</button>
                                        <button className="dropdown-item" onClick={(e) => { setStat('1'); setCondition('filter'); filterLeadsStat('1'); }}>Potential Customer</button>
                                        <button className="dropdown-item" onClick={(e) => { setStat('pending'); setCondition('filter'); filterLeadsStat('pending'); }}>Pending</button>
                                        <button className="dropdown-item" onClick={(e) => { setStat('uninterested'); setCondition('filter'); filterLeadsStat('uninterested'); }}>Uninterested</button>
                                        <button className="dropdown-item" onClick={(e) => { setStat('set'); setCondition('filter'); filterLeadsStat('set'); }}>Meeting set</button>
                                        <button className="dropdown-item" onClick={(e) => { setStat('offersend'); setCondition('filter'); filterLeadsStat('offersend'); }}>Price offer sent</button>
                                        <button className="dropdown-item" onClick={(e) => { setStat('offerdecline'); setCondition('filter'); filterLeadsStat('offerdecline'); }}>Declined price offer</button>

                                    </div>
                                </div>

                                <input type='text' className="form-control" onChange={(e) => { filterLeads(e) }} placeholder="Search" />
                                <Link to="/admin/add-lead" className="btn btn-pink addButton"><i className="btn-icon fas fa-plus-circle"></i>Add New</Link>
                            </div>
                        </div>
                        <div className='col-sm-6 hidden-xl mt-4'>
                            <select className='form-control' onChange={e => sortTable(e, e.target.value)}>
                                <option selected>-- Sort By--</option>
                                <option value="id">ID</option>
                                <option value="name">Name</option>
                                <option value="email">Email</option>
                                <option value="phone">Phone</option>
                                <option value="status">Status</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <div className="boxPanel">
                            {leads.length > 0 ? (
                                <Table className='table table-bordered'>
                                    <Thead>
                                        <Tr style={{ cursor: 'pointer' }}>
                                            <Th onClick={(e) => { sortTable(e, 'id') }} >ID  <span className='arr'> &darr; </span></Th>
                                            <Th onClick={(e) => { sortTable(e, 'name') }}>Name  <span className='arr'> &darr; </span></Th>
                                            <Th onClick={(e) => { sortTable(e, 'email') }}>Email  <span className='arr'> &darr; </span></Th>
                                            <Th onClick={(e) => { sortTable(e, 'phone') }}>Phone  <span className='arr'> &darr; </span></Th>
                                            <Th onClick={(e) => { sortTable(e, 'status') }}>Status  <span className='arr'> &darr; </span></Th>
                                            <Th>Action</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {leads &&
                                            leads.map((item, index) => {
                                                return (
                                                    <Tr style={{ "cursor": "pointer" }}>
                                                        <Td onClick={(e) => handleNavigate(e, item.id)}>{item.id}</Td>
                                                        <Td>
                                                            <Link to={`/admin/view-lead/${item.id}`}>{item.firstname}{" "}{item.lastname}</Link>
                                                        </Td>
                                                        <Td onClick={(e) => handleNavigate(e, item.id)}>{item.email}</Td>
                                                        <Td>
                                                            {item.phone}
                                                        </Td>
                                                        <Td>
                                                            {
                                                                item.lead_status ? item.lead_status.lead_status : 'Pending'
                                                            }
                                                        </Td>
                                                        <Td>
                                                            <div className="action-dropdown dropdown">
                                                                <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown">
                                                                    <i className="fa fa-ellipsis-vertical"></i>
                                                                </button>
                                                                <div className="dropdown-menu">
                                                                    <Link to={`/admin/edit-lead/${item.id}`} className="dropdown-item">Edit</Link>
                                                                    <Link to={`/admin/view-lead/${item.id}`} className="dropdown-item">View</Link>
                                                                   { item.lead_status?.lead_status == 'Pending' || item.lead_status == null  && <button onClick={() => unintrested(item.id)} className="dropdown-item">Uninterested</button> }
                                                                    <button className="dropdown-item" onClick={() => handleDelete(item.id)}
                                                                    >Delete</button>
                                                                </div>
                                                            </div>
                                                        </Td>
                                                    </Tr>)
                                            })}
                                    </Tbody>
                                </Table>
                            ) : (
                                <p className="text-center mt-5">{loading}</p>
                            )}
                            {leads.length > 0 ? (
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
            </div>
        </div>
    );
}

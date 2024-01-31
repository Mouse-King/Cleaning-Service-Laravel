import React, { useState, useEffect } from "react";
import Sidebar from "../../Layouts/Sidebar";
import { Link } from "react-router-dom";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import { useNavigate } from "react-router-dom";
import { CSVLink } from "react-csv";

export default function Lead() {

    const [clients, setClients] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [filter,setFilter] = useState('');
    const [loading, setLoading] = useState("Loading...");

    const [stat,setStat] = useState(null);
    
    const navigate = useNavigate();
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };

    const getclients = () => {
        axios.get("/api/admin/clients?q=lead", { headers }).then((response) => {

            if (response.data.clients.data.length > 0) {
                setClients(response.data.clients.data);
                setPageCount(response.data.clients.last_page);
            } else {
                setLoading("No client found");
            }
        });
    };

    
    useEffect(() => {
        getclients();
    }, []);


    const filterClients = (e) => {
        axios
            .get(`/api/admin/clients?l=lead&q=${e.target.value}`, { headers })
            .then((response) => {
                if (response.data.clients.data.length > 0) {
                    setClients(response.data.clients.data);
                    setPageCount(response.data.clients.last_page);
                } else {
                    setClients([]);
                    setPageCount(response.data.clients.last_page);
                    setLoading("No client found");
                }
            })
    }

    const filterClientsStat = (s) => {
        setFilter(s);
        axios
            .get(`/api/admin/clients?l=lead&q=${s}`, { headers })
            .then((response) => {
                if (response.data.clients.data.length > 0) {
                    setClients(response.data.clients.data);
                    setPageCount(response.data.clients.last_page);
                } else {
                    setClients([]);
                    setPageCount(response.data.clients.last_page);
                    setLoading("No client found");
                }
            })
    }

    const booknun = (s) => {

        setFilter(s);
        axios
            .get(`/api/admin/clients?l=lead&action=${s}`, { headers })
            .then((response) => {
                if (response.data.clients.data.length > 0) {
                    setClients(response.data.clients.data);
                    setPageCount(response.data.clients.last_page);
                } else {
                    setClients([]);
                    setPageCount(response.data.clients.last_page);
                    setLoading("No client found");
                }
            })
      
    }

    const handlePageClick = async (data) => {
        let currentPage = data.selected + 1;
        let cn = (filter == 'booked' || filter == 'notbooked') ? "&action=" : "&q=";

        axios
            .get("/api/admin/clients?l=lead&page=" + currentPage+cn+filter, { headers })
            .then((response) => {
                if (response.data.clients.data.length > 0) {
                    setClients(response.data.clients.data);
                    setPageCount(response.data.clients.last_page);
                } else {
                    setLoading("No client found");
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
            confirmButtonText: "Yes, Delete Client!",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`/api/admin/clients/${id}`, { headers })
                    .then((response) => {
                        Swal.fire(
                            "Deleted!",
                            "Client has been deleted.",
                            "success"
                        );
                        setTimeout(() => {
                            getclients();
                        }, 1000);
                    });
            }
        });
    };
    const handleNavigate = (e, id) => {
        e.preventDefault();
        navigate(`/admin/view-client/${id}`);
    }

    const copy = [...clients];
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
            setClients(sortData);
            setOrder('DESC');
        }
        if(order == 'DESC'){
            const sortData = [...copy].sort((a, b) => (a[col] < b[col] ? -1 : 1));
            setClients(sortData);
            setOrder('ASC');
        }
        
    }


    const [Alldata, setAllData] = useState([]);
   
    const handleReport = (e) => {
        e.preventDefault();

        let cn = (stat == 'booked' || stat == 'notbooked') ? "action=" : "f=";

        axios.get("/api/admin/clients_export?"+cn+stat, { headers }).then((response) => {

            if (response.data.clients.length > 0) {

                let r = response.data.clients;

                if(r.length > 0){
                    for (let k in r){
                        delete r[k]['extra'];
                        delete r[k]['jobs'];
                    }
                }
                 console.log(r)
                 setAllData(r);
                 document.querySelector('#csv').click();

            } else {
               
            }
        });

    }

    const csvReport = {
        data: Alldata,
        filename: 'clients'
    };


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

                            <div classname="App" style={{display:"none"}}>
                                <CSVLink {...csvReport}  id="csv">Export to CSV</CSVLink>
                            </div>

                            <div className="action-dropdown dropdown mt-4 mr-2">
                                <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown">
                                    <i className="fa fa-filter"></i>
                                </button>
                                <div className="dropdown-menu">
                                    <button className="dropdown-item" onClick={(e)=>{setStat('null');getclients()}}>All</button>
                                    <button className="dropdown-item" onClick={(e)=>handleReport(e)}>Export</button>
                                </div>
                            </div>

                                <input type='text' className="form-control" onChange={(e)=>{filterClients(e);setFilter(e.target.value)}} placeholder="Search" />
                                <Link to="/admin/add-lead" className="btn btn-pink addButton"><i className="btn-icon fas fa-plus-circle"></i>Add New</Link>
                            </div>
                        </div>
                        <div className='col-sm-6 hidden-xl mt-4'>
                          <select className='form-control' onChange={e => sortTable(e,e.target.value)}>
                          <option selected>-- Sort By--</option>
                           <option value="id">ID</option>
                           <option value="firstname">Client Name</option>
                           <option value="address">Address</option>
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
                            {clients.length > 0 ? (
                                <Table className='table table-bordered'>
                                    <Thead>
                                        <Tr style={{cursor:'pointer'}}>
                                            <Th onClick={(e)=>{sortTable(e,'id')}} >ID  <span className='arr'> &darr; </span></Th>
                                            <Th onClick={(e)=>{sortTable(e,'firstname')}}>Client Name  <span className='arr'> &darr; </span></Th>
                                            <Th onClick={(e)=>{sortTable(e,'email')}}>Email  <span className='arr'> &darr; </span></Th>
                                            <Th onClick={(e)=>{sortTable(e,'address')}}>Address  <span className='arr'> &darr; </span></Th>
                                            <Th onClick={(e)=>{sortTable(e,'phone')}}>Phone  <span className='arr'> &darr; </span></Th>
                                            <Th onClick={(e)=>{sortTable(e,'status')}}>Status  <span className='arr'> &darr; </span></Th>
                                            <Th>Action</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {clients &&
                                            clients.map((item, index) => {
                                              if(item){
                                                let address = (item.geo_address) ? item.geo_address : "NA";
                                                let cords = (item.latitude && item.longitude) ? item.latitude + "," + item.longitude : "";
                                                let status = '';
                                                if (item.status == 0)
                                                    status = "Lead";
                                                if (item.status == 1)
                                                    status = "Potential Customer";
                                                if (item.status == 2)
                                                    status = "Customer";
                                               
                                                let phone = (item.phone) ? item.phone.toString().split(",") : [];

                                                return (
                                                    <Tr style={{ "cursor": "pointer" }}>
                                                        <Td onClick={(e) => handleNavigate(e, item.id)}>{item.id}</Td>
                                                        <Td>
                                                            <Link to={`/admin/view-client/${item.id}`}>{item.firstname}{" "}{item.lastname}</Link>
                                                        </Td>
                                                        <Td onClick={(e) => handleNavigate(e, item.id)}>{item.email}</Td>
                                                        <Td><a href={`https://maps.google.com?q=${cords}`} target='_blank'>{address}</a></Td>
                                                        {/*<Td><a  href={`tel:${item.phone.toString().split(",").join(' | ')}`}>{(item.phone) ? item.phone.toString().split(",").join(' | ') : ''}</a></Td>*/}
                                                        
                                                        <Td>
                                                            {
                                                                phone && phone.map((p,i)=>{
                                                                  return(
                                                                    (phone.length > 1) ?
                                                                    <a href={`tel:${p}`}>{ p } | </a> 
                                                                    : <a href={`tel:${p}`}>{ p }</a>
                                                                  )
                                                                })
                                                            }
                                                        </Td>
                                                       
                                                        <Td onClick={(e) => handleNavigate(e, item.id)}>
                                                            {
                                                                status
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
                                                                    <button className="dropdown-item" onClick={() => handleDelete(item.id)}
                                                                    >Delete</button>
                                                                </div>
                                                            </div>
                                                        </Td>
                                                    </Tr>)
                                                }
                                            })}
                                    </Tbody>
                                </Table>
                            ) : (
                                <p className="text-center mt-5">{loading}</p>
                            )}
                            {clients.length > 0 ? (
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

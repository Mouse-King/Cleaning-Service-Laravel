import React, { useState, useEffect } from 'react'
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import Sidebar from '../../Layouts/Sidebar';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import { useNavigate } from 'react-router-dom';

export default function OfferPrice() {

    const [offers, setOffers] = useState();
    const [totalOffers, setTotalOffers] = useState([]);
    const [loading, setLoading] = useState("Loading...");
    const [filter,setFilter] = useState('');
    const [pageCount, setPageCount] = useState(0);
    const navigate = useNavigate();
    const [copy,setCopy] = useState([]);

    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };

    const getOffers = () => {
        axios
            .get('/api/admin/offers', { headers })
            .then((response) => {
                if (response.data.offers.data.length > 0) {
                    setTotalOffers(response.data.offers.data);
                    setOffers(response.data.offers.data);
                    setCopy(response.data.offers.data);
                    setPageCount(response.data.offers.last_page);
                } else {
                    setLoading("No offer found");
                }

            });
    }

    const handlePageClick = async (data) => {
        let currentPage = data.selected + 1;
        axios
            .get("/api/admin/offers?page=" + currentPage+"&q="+filter, { headers })
            .then((response) => {
                if (response.data.offers.data.length > 0) {
                    setTotalOffers(response.data.offers.data);
                    setOffers(response.data.offers.data);
                    setPageCount(response.data.offers.last_page);
                } else {
                    setLoading("No offer found");
                }
            });
    };

    const filterOffers = (e) => {
        axios
            .get(`/api/admin/offers?q=${e.target.value}`, { headers })
            .then((response) => {
                if (response.data.offers.data.length > 0) {
                    setTotalOffers(response.data.offers.data);
                    setOffers(response.data.offers.data);
                    setPageCount(response.data.offers.last_page);
                } else {
                    setTotalOffers([]);
                    setPageCount(response.data.offers.last_page);
                    setLoading("No offer found");
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
            confirmButtonText: "Yes, Delete Offer!",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`/api/admin/offers/${id}`, { headers })
                    .then((response) => {
                        Swal.fire(
                            "Deleted!",
                            "Offer has been deleted.",
                            "success"
                        );
                        setTimeout(() => {
                            getOffers();
                        }, 1000);
                    });
            }
        });
    };


    useEffect(() => {
        getOffers();
    }, []);

    const handleNavigate = (e, id) => {
        e.preventDefault();
        navigate(`/admin/view-offer/${id}`);
    }
   
    const [order, setOrder] = useState('ASC');
    const sortTable = (e,col) => {
        
        let n = e.target.nodeName;
        if( n != "SELECT"){
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
            setOffers(sortData);
            setOrder('DESC');
        }
        if (order == 'DESC') {
            const sortData = [...copy].sort((a, b) => (a[col] < b[col] ? -1 : 1));
            setOffers(sortData);
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
                            <h1 className="page-title">Offered Prices</h1>
                        </div>
                        <div className="col-sm-6">
                            <div className="search-data">
                                <input type='text' className="form-control" onChange={(e)=>{filterOffers(e);setFilter(e.target.value);}} placeholder="Search" />
                                <Link to="/admin/add-offer" className="btn btn-pink addButton"><i class="btn-icon fas fa-plus-circle"></i>Add New</Link>
                            </div>
                        </div>

                        <div className='col-sm-6 hidden-xl mt-4'>
                          <select className='form-control' onChange={e => sortTable(e,e.target.value)}>
                          <option selected>-- Sort By--</option>
                           <option value="subtotal">Total</option>
                           <option value="status">Status</option>
                          </select>
                        </div>

                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <div className="boxPanel">
                            <div className="table-responsive">

                                {totalOffers.length > 0 ? (

                                    <Table className="table table-bordered">
                                        <Thead>
                                            <Tr>
                                                <Th scope="col">Client</Th>
                                                <Th scope="col">Email</Th>
                                                <Th scope="col">Address</Th>
                                                <Th scope="col">Phone</Th>
                                                <Th style={{cursor:'pointer'}} onClick={(e)=>sortTable(e,'status')} scope="col">Status <span className='arr'> &darr; </span></Th>
                                                <Th style={{cursor:'pointer'}} onClick={(e)=>sortTable(e,'subtotal')} scope="col">Total <span className='arr'> &darr; </span></Th>
                                                <Th scope="col">Action</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {offers && offers.map((ofr, i) => {

                                                if (ofr.client) {
                                                    var address = (ofr.client.geo_address) ? ofr.client.geo_address : 'NA';
                                                    var cords = (ofr.client.latitude && ofr.client.longitude)
                                                        ? ofr.client.latitude + "," + ofr.client.longitude : 'NA';
                                                    let color = "";
                                                    if (ofr.status == 'sent') { color = 'purple' }
                                                    else if (ofr.status == 'accepted') { color = 'green' }
                                                    else { color = 'red' }
                                                    
                                                    let phone = (ofr.client.phone != undefined ) ? ofr.client.phone.split(',') : [];

                                                    return (
                                                        <Tr style={{ "cursor": "pointer" }}>
                                                            <Td><Link to={`/admin/view-client/${ofr.client.id}`}>
                                                                {
                                                                    ofr.client
                                                                        ? ofr.client.firstname
                                                                        + " " + ofr.client.lastname
                                                                        : "NA"
                                                                }
                                                            </Link>
                                                            </Td>
                                                            <Td onClick={(e) => handleNavigate(e, ofr.id)}>{ofr.client.email}</Td>
                                                            <Td><Link to={`https://maps.google.com?q=${cords}`}>{address}</Link></Td>
                                                          
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
                                                            <Td style={{ color }} onClick={(e) => handleNavigate(e, ofr.id)}>{ofr.status}</Td>
                                                            <Td onClick={(e) => handleNavigate(e, ofr.id)}>{ofr.subtotal} ILS + VAT</Td>
                                                            <Td>
                                                                <div className="action-dropdown dropdown">
                                                                    <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown">
                                                                        <i className="fa fa-ellipsis-vertical"></i>
                                                                    </button>
                                                                    <div className="dropdown-menu">
                                                                        <Link to={`/admin/edit-offer/${ofr.id}`} className="dropdown-item">Edit</Link>
                                                                        <Link to={`/admin/view-offer/${ofr.id}`} className="dropdown-item">View</Link>
                                                                        <button className="dropdown-item" onClick={() => handleDelete(ofr.id)}
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
                                    <p className="text-center mt-5">{loading}</p>
                                )}
                            </div>

                            {totalOffers.length > 0 ? (
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

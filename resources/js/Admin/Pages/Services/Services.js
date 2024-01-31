import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import Sidebar from "../../Layouts/Sidebar";
import { Link } from "react-router-dom";
import {Table, Thead, Tbody, Tr, Th, Td} from 'react-super-responsive-table'

export default function Services() {

    const [services, setServices] = useState("");
    const [pageCount, setPageCount] = useState(0);
    const [loading, setLoading] = useState("Loading...");
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };

    const getservices = () => {
        axios.get("/api/admin/services", { headers }).then((response) => {

            if (response.data.services.data.length > 0) {
                setServices(response.data.services.data);
                setPageCount(response.data.services.last_page);
            } else {
                setLoading("No service found");
            }
        });
    };
    useEffect(() => {
        getservices();
    }, []);

    

    const handlePageClick = async (data) => {
        let currentPage = data.selected + 1;
        axios
            .get("/api/admin/services?page=" + currentPage, { headers })
            .then((response) => {
                if (response.data.services.data.length > 0) {
                    setServices(response.data.services.data);
                    setPageCount(response.data.services.last_page);
                } else {
                    setLoading("No service found");
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
            confirmButtonText: "Yes, Delete Service!",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`/api/admin/services/${id}`, { headers })
                    .then((response) => {
                        Swal.fire(
                            "Deleted!",
                            "Service has been deleted.",
                            "success"
                        );
                        setTimeout(() => {
                            getservices();
                        }, 1000);
                    });
            }
        });
    };
    const copy = [...services];
    const [order,setOrder] = useState('ASC');
    const sortTable = (e,col) =>{
        
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


        if(order == 'ASC'){
            const sortData = [...copy].sort((a, b) => (a[col] < b[col] ? 1 : -1));
            setServices(sortData);
            setOrder('DESC');
        }
        if(order == 'DESC'){
            const sortData = [...copy].sort((a, b) => (a[col] < b[col] ? -1 : 1));
            setServices(sortData);
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
                                <h1 className="page-title">Services</h1>
                            </div>
                            <div className="col-sm-6">
                                <Link
                                    to="/admin/add-service"
                                    className="ml-2 btn btn-success addButton">
                                    Add Service
                                </Link>
                                <Link
                                    to="/admin/service-schedule"
                                    className="ml-2 btn btn-warning addButton">
                                    Schedules
                                </Link>
                                <Link
                                    to="/admin/templates"
                                    className="btn btn-pink addButton">
                                    Templates
                                </Link>

                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-body">

                            <div className="boxPanel">
                                <div className="table-responsive">
                                    {services.length > 0 ? (
                                        <Table className="table table-bordered">
                                            <Thead>
                                                <Tr>
                                                    <Th scope="col" style={{cursor:"pointer"}} onClick={(e)=>{sortTable(e,'id')}} >ID <span className="arr"> &darr;</span></Th>
                                                    <Th scope="col" style={{cursor:"pointer"}} onClick={(e)=>{sortTable(e,'name')}}>Service - En <span className="arr"> &darr;</span></Th>
                                                    <Th scope="col" style={{cursor:"pointer"}} onClick={(e)=>{sortTable(e,'heb_name')}}>Service - Heb <span className="arr"> &darr;</span></Th>
                                                    <Th scope="col" style={{cursor:"pointer"}} onClick={(e)=>{sortTable(e,'status')}}>Status <span className="arr"> &darr;</span></Th>
                                                    <Th scope="col">Action</Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {services &&
                                                    services.map((item, index) => (
                                                        <Tr key={index}>
                                                            <Td>{item.id}</Td>
                                                            <Td>{item.name}</Td>
                                                            <Td>{item.heb_name}</Td>
                                                            <Td>
                                                                {item.status == 0
                                                                    ? "Inactive"
                                                                    : "Active"}
                                                            </Td>
                                                            <Td>
                                                                <div className="action-dropdown dropdown">
                                                                    <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown">
                                                                        <i className="fa fa-ellipsis-vertical"></i>
                                                                    </button>
                                                                    <div className="dropdown-menu">
                                                                        <Link to={`/admin/edit-service/${item.id}`} className="dropdown-item">Edit</Link>
                                                                        <button className="dropdown-item" onClick={() => handleDelete(item.id)}
                                                                        >Delete</button>
                                                                    </div>
                                                                </div>
                                                            </Td>
                                                        </Tr>
                                                    ))}
                                            </Tbody>
                                        </Table>
                                    ) : (
                                        <p className="text-center mt-5">{loading}</p>
                                    )}
                                    {services.length > 0 ? (
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
        </div>

    );
}
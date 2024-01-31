import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import Sidebar from "../../Layouts/Sidebar";
import { Link } from "react-router-dom";
import {Table, Thead, Tbody, Tr, Th, Td} from 'react-super-responsive-table'

export default function ServiceSchedule() {

    const [schedules, setSchedules] = useState("");
    const [pageCount, setPageCount] = useState(0);
    const [loading, setLoading] = useState("Loading...");
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };

    const getSchedules = () => {
        axios.get("/api/admin/service-schedule", { headers }).then((response) => {
            console.log(response);
            if (response.data.schedules.data.length > 0) {
                setSchedules(response.data.schedules.data);
                setPageCount(response.data.schedules.last_page);
            } else {
                setLoading("No schedule found");
            }
        });
    };
    useEffect(() => {
        getSchedules();
    }, []);

    const handlePageClick = async (data) => {
        let currentPage = data.selected + 1;
        axios
            .get("/api/admin/service-schedule?page=" + currentPage, { headers })
            .then((response) => {
                if (response.data.schedules.data.length > 0) {
                    setSchedules(response.data.schedules.data);
                    setPageCount(response.data.schedules.last_page);
                } else {
                    setLoading("No schedule found");
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
            confirmButtonText: "Yes, Delete Schedule!",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`/api/admin/service-schedule/${id}`, { headers })
                    .then((response) => {
                        Swal.fire(
                            "Deleted!",
                            "Schedule has been deleted.",
                            "success"
                        );
                        setTimeout(() => {
                            getSchedules();
                        }, 1000);
                    });
            }
        });
    };

    return (
        <div id="container">
            <Sidebar />
            <div id="content">
                <div className="titleBox customer-title">
                    <div className="row">
                        <div className="col-sm-6">
                            <h1 className="page-title">Service Schedules</h1>
                        </div>
                        <div className="col-sm-6">
                            <Link
                                to="/admin/add-service-schedule"
                                className="ml-2 btn btn-success addButton">
                                Add Schedule
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">

                        <div className="boxPanel">
                            <div className="table-responsive">
                                {schedules.length > 0 ? (
                                    <Table className="table table-bordered">
                                        <Thead>
                                            <Tr>
                                                <Th scope="col">ID</Th>
                                                <Th scope="col">Schedule- En</Th>
                                                <Th scope="col">Schedule- Heb</Th>
                                                <Th scope="col">Status</Th>
                                                <Th scope="col">Action</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {schedules &&
                                                schedules.map((item, index) => (
                                                    <Tr key={index}>
                                                        <Td>{item.id}</Td>
                                                        <Td>{item.name}</Td>
                                                        <Td>{item.name_heb}</Td>
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
                                                                    <Link to={`/admin/edit-service-schedule/${item.id}`} className="dropdown-item">Edit</Link>
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
                                {schedules.length > 0 ? (
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
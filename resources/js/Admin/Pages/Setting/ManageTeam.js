import React, { useState, useEffect } from 'react'
import Sidebar from '../../Layouts/Sidebar'
import { Link } from 'react-router-dom';
import axios from 'axios';
import ReactPaginate from "react-paginate";
import {Table, Thead, Tbody, Tr, Th, Td} from 'react-super-responsive-table'

export default function ManageTeam() {

    const [item, setItem] = useState([]);
    const [loading, setLoading] = useState("Loading...");
    const [pageCount, setPageCount] = useState(0);

    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };

    const handlePageClick = async (data) => {
        let currentPage = data.selected + 1;
        axios
          .get("/api/admin/team?page=" + currentPage, { headers })
          .then((response) => {
            if (response.data.team.data.length > 0) {
              setItem(response.data.team.data);
              setPageCount(response.data.team.last_page);
            } else {
              setLoading("No member found");
            }
          });
      };

    const getMembers = () => {
        axios
            .get('/api/admin/team', { headers })
            .then((response) => {
                console.log(response);
                if (response.data.team.data.length > 0) {
                    setItem(response.data.team.data);
                    setPageCount(response.data.team.last_page);
                  } else {
                    setLoading("No member found");
                  }
            });
    };

    useEffect(() => {
        getMembers();
    }, []);
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Delete Team member!",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`/api/admin/team/${id}`, { headers })
                    .then((response) => {
                        Swal.fire(
                            "Deleted!",
                            "Team member has been deleted.",
                            "success"
                        );
                        setTimeout(() => {
                            getMembers();
                        }, 1000);
                    });
            }
        });
    };

    const filterTeam=(e) =>{
        axios
        .get(`/api/admin/team?q=${e.target.value}`, { headers })
        .then((response) => {
        if (response.data.team.data.length > 0) {
            setItem(response.data.team.data);
            setPageCount(response.data.team.last_page);
        } else {
            setItem([]);
            setPageCount(response.data.team.last_page);
            setLoading("No member found");
        }
        })
    }

    const copy = [...item];
    const [order,setOrder] = useState('ASC');
    const sortTable = (e,col) =>{
        
        let n = e.target.nodeName;
        if(n != "SELECT") {
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
            setItem(sortData);
            setOrder('DESC');
        }
        if(order == 'DESC'){
            const sortData = [...copy].sort((a, b) => (a[col] < b[col] ? -1 : 1));
            setItem(sortData);
            setOrder('ASC');
        }
        
    }

    return (
        <div id='container'>
            <Sidebar />
            <div id='content'>
                <div className="titleBox customer-title">
                    <div className="row">
                        <div className="col-sm-6">
                            <h1 className="page-title">Team</h1>
                        </div>
                        <div className="col-sm-6">
                            <div className="search-data">
                                <input type='text' className="form-control" onChange={filterTeam} placeholder="Search" />
                                <Link to="/admin/add-team" className="btn btn-pink addButton"><i className="btn-icon fas fa-plus-circle"></i>Add New</Link>
                            </div>
                        </div>
                        <div className='col-sm-6 hidden-xl mt-4'>
                          <select className='form-control' onChange={e => sortTable(e,e.target.value)}>
                          <option selected>-- Sort By--</option>
                           <option value="name">Name</option>
                           <option value="email">Email</option>
                           <option value="phone">Phone</option>
                           <option value="status">Status</option>
                          </select>
                        </div>
                    </div>
                </div>
                <div className='dashBox p-4'>
                    <div className="table-responsive">
                        { item.length > 0 ? (
                        <Table className="table table-bordered">
                            <Thead>
                                <Tr style={{"cursor":"pointer"}}>
                                    <Th scope="col" onClick={(e)=>{sortTable(e,'name')}}>Name   <span className="arr"> &darr;</span></Th>
                                    <Th scope="col" onClick={(e)=>{sortTable(e,'email')}}>Email <span className="arr"> &darr;</span></Th>
                                    <Th scope="col" onClick={(e)=>{sortTable(e,'phone')}}>Phone <span className="arr"> &darr;</span></Th>
                                    <Th scope="col" onClick={(e)=>{sortTable(e,'status')}}>Status <span className="arr"> &darr;</span></Th>
                                    <Th scope="col">Action</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {item && item.map((item, index) => (
                                    <Tr key={index}>
                                        <Td>{item.name}</Td>
                                        <Td>{item.email}</Td>
                                        <Td>{item.phone}</Td>
                                        <Td>
                                            {
                                                (item.status == 1)
                                                    ? 'Active'
                                                    : 'Inactive'
                                            }</Td>
                                        <Td>
                                            <div className="action-dropdown dropdown">
                                                <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown">
                                                    <i className="fa fa-ellipsis-vertical"></i>
                                                </button>
                                                <div className="dropdown-menu">
                                                    <Link to={`/admin/edit-team/${item.id}`} className="dropdown-item">Edit</Link>
                                                    <button className="dropdown-item" onClick={() => handleDelete(item.id)}
                                                    >Delete</button>
                                                </div>
                                            </div>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                        )
                        :
                        (
                            <div className='text-center'>{loading}</div>
                        )
                        }
                    </div>
                    {item.length > 0 ? (
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
    )
}

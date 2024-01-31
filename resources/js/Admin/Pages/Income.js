import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Sidebar from "../Layouts/Sidebar";
import ReactPaginate from "react-paginate";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import axios from "axios";

export default function income() {

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState("Loading...");
    const [totalTask,setTotalTask] = useState(0);
    const [income,setIncome] = useState(0);
    const [role,setRole] = useState();
    const navigate = useNavigate();
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };
    const getTasks = (duration) => {
        axios
            .post('/api/admin/income', {duration},{ headers })
            .then((res) => {
                if (res.data.tasks.length > 0) {
                    setTasks(res.data.tasks);
                    setTotalTask(res.data.total_tasks);
                    setIncome(res.data.income);
                } else {
                    setTasks([]);
                    setLoading('No Completed Tasks found.');
                }
            });
    }
    function toHoursAndMinutes(totalSeconds) {
        const totalMinutes = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        const h = Math.floor(totalMinutes / 60);
        const m = totalMinutes % 60;
        return decimalHours(h, m, s);
    }

    function decimalHours(h, m, s) {

        var hours = parseInt(h, 10);
        var minutes = m ? parseInt(m, 10) : 0;
        var min = minutes / 60;
        return hours + ":" + min.toString().substring(0, 4);


    }
    const filter = (e,duration) =>{
        e.preventDefault();
        getTasks(duration);
    }
    const getAdmin = () =>{
        axios
        .get(`/api/admin/details`,{ headers })
        .then((res)=>{
            setRole(res.data.success.role);
        });
    };
    useEffect(() => {
        getTasks();
        getAdmin();
        if(role == 'member'){
            navigate('/admin/dashboard');
        }
    }, [])
   
    return (
        <div id="container">
            <Sidebar />
            <div id="content">
                <div className="titleBox card card-body p-3 m-3">
                    <div className="row">
                        <div className="col-sm-6">
                            <h4 className="page-title">Total Jobs : {totalTask}</h4>
                            <h4 className="page-title">Income : {income}</h4>
                            <h4 className="page-title">Outcome : 0</h4>
                        </div>
                        <div className="col-sm-6">
                            <div className="search-data" style={{ cursor: "pointer" }}>
                                <span className="p-2" onClick={e=>filter(e,'day')}>Day</span>
                                <span className="p-2" onClick={e=>filter(e,'week')}>Week</span>
                                <span className="p-2" onClick={e=>filter(e,'month')}>Month</span>
                                <span className="p-2" onClick={e=>filter(e,'all')}>All</span>
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="card">
                    <div className="card-body">
                        <div className="boxPanel">
                            {tasks.length > 0 ? (
                                <Table className='table table-bordered'>
                                    <Thead>
                                        <Tr style={{ cursor: 'pointer' }}>
                                            <Th>ID</Th>
                                            <Th>Worker Name</Th>
                                            <Th>Client Name</Th>
                                            <Th>Time Takes</Th>
                                            <Th>Income</Th>
                                            <Th>Outcome</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {tasks &&
                                            tasks.map((item, index) => {
                                                let time = (item.total_sec != null) ? toHoursAndMinutes(item.total_sec) : 0;
                                                return (
                                                    <Tr>
                                                        <Td >{item.id}</Td>
                                                        <Td>

                                                            {item.worker.firstname}{" "}{item.worker.lastname}
                                                        </Td>
                                                        <Td > {item.client.firstname}{" "}{item.client.lastname}</Td>
                                                        <Td>{time}</Td>
                                                        <Td >{item.offer ? item.offer.subtotal + " ILS + VAT " : ''}</Td>
                                                        <Td >{0}</Td>

                                                    </Tr>)
                                            })}
                                    </Tbody>
                                </Table>
                            ) : (
                                <p className="text-center mt-5">{loading}</p>
                            )}
                            {/*clients.length > 0 ? (
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
                            )*/}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
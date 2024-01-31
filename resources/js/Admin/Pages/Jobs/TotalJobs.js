import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import axios from "axios";
import Sidebar from "../../Layouts/Sidebar";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import { useLocation } from 'react-router-dom'
import Moment from "moment";
import { useNavigate } from "react-router-dom";
import { CSVLink } from "react-csv";
import { intlDateTimeFormatSupported } from "javascript-time-ago";
export default function TotalJobs() {

    const [totalJobs, setTotalJobs] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [loading, setLoading] = useState("Loading...");
    const [AllClients, setAllClients] = useState([]);
    const [AllServices, setAllServices] = useState([]);
    const [AllWorkers, setAllWorkers] = useState([]);
    const [filter,setFilter] = useState('');
    const [from,setFrom] = useState([]);
    const [to,setTo] = useState([]);
    const alert = useAlert();
    const location = useLocation();
    const navigate = useNavigate();
    const query = (location.search.split('=')[1]);

    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };

    const getJobs = () => {
        axios.get(`/api/admin/jobs`, { headers }).then((response) => {
            if (response.data.jobs.data.length > 0) {
                setTotalJobs(response.data.jobs.data);
                setPageCount(response.data.jobs.last_page);
            } else {
                setTotalJobs([]);
                setLoading("No Job found");
            }
        });
    };
    const getClients = () => {
        axios
            .get('/api/admin/all-clients', { headers })
            .then((res) => {
                setAllClients(res.data.clients);
            })

    }

    const getServices = () => {
        axios
            .get('/api/admin/all-services', { headers })
            .then((res) => {
                setAllServices(res.data.services);
            })
    }

    const getWorkers = () => {
        axios
            .get('/api/admin/all-workers', { headers })
            .then((res) => {
                setAllWorkers(res.data.workers);
            })
    }

    useEffect(() => {
        getClients();
        getServices();
        getWorkers();
        getJobs();
    }, []);

    const handlePageClick = async (data) => {
        let currentPage = data.selected + 1;
        axios
            .get("/api/admin/jobs?page=" + currentPage+"&filter_week=all&q="+filter, { headers })
            .then((response) => {
                if (response.data.jobs.data.length > 0) {
                    setTotalJobs(response.data.jobs.data);
                    setPageCount(response.data.jobs.last_page);
                } else {
                    setLoading("No Job found");
                    setTotalJobs([]);
                }
            });
    };

    const getTotalJobs = (response) => {
        if (response.data.jobs.data.length > 0) {
            setTotalJobs(response.data.jobs.data);
            setPageCount(response.data.jobs.last_page);
        } else {
            setTotalJobs([]);
            setPageCount(response.data.jobs.last_page);
            setLoading("No Job found");
        }
    };

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
    const handleDate = (e, index) => {
        let newTotalJobs = [...totalJobs];
        newTotalJobs[index][e.target.name] = e.target.value;
        setTotalJobs(newTotalJobs);
    }

    const [workers, setWorkers] = useState([]);
    const [Aworker,setAworker] = useState([]);
    const handleChange = (e, index) => {
        const id = (e.target.name);
        axios
        .get(`/api/admin/job-worker/${id}`,{ headers })
        .then((res)=>{
            if(res.data.aworker.length > 0){
                setAworker(res.data.aworker);
            }else {
                setAworker([]);
            }
           
        })
        
       
    }
    const upWorker=(e,index) =>{

        let newWorkers = [...workers];
        newWorkers[e.target.name] = e.target.value;
        setWorkers(newWorkers);
        let up = e.target.parentNode.parentNode.lastChild.lastChild;
        setTimeout(() => {
            up.click();
        }, 500);
    }

    const handleform = (job_id, e) => {
        let date = '';
        let worker = getSelectedWorkers(job_id);
        let shifts = null;

        let data = {
            date: date,
            worker: (worker != undefined) ? worker : '',
            shifts: (shifts != null) ? shifts : '',
        }
        axios
            .post(`/api/admin/upldate-job/${job_id}`, data, { headers })
            .then((response) => {
                if (response.data.errors) {
                    setErrors(response.data.errors);
                } else {
                    alert.success("Job Updated Successfully");
                    setTimeout(() => {
                        getJobs();
                    }, 1000);
                }
            });

    }
    const getSelectedWorkers = (job_id) => {
        if (workers[job_id] !== 'undefined') {
            return workers[job_id];
        } else {
            return '';
        }

    };
    const handleNavigate = (e, id) => {
        e.preventDefault();
        navigate(`/admin/view-job/${id}`);
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

    const header = [
        { label: "Worker Name", key: "worker_name" },
        { label: "Worker ID", key: "worker_id" },
        { label: "Start Time", key: "start_time" },
        { label: "End Time", key: "end_time" },
        { label: "Total Time", key: "time_diffrence" },
    ];


    const [Alldata, setAllData] = useState([]);
    const [filename, setFilename] = useState("");
    const handleReport = (e) => {
        e.preventDefault();

        if(!from) { window.alert("Please select form date!"); return false;}
        if(!to) { window.alert("Please select to date!"); return false;}

        axios.post(`/api/admin/export_report`, { type: 'all',from:from,to:to }, { headers })
            .then((res) => {
                if (res.data.status_code == 404) {
                    alert.error(res.data.msg);
                } else {
                    setFilename(res.data.filename);
                    let rep = res.data.report;
                    for (let r in rep) {
                        rep[r].time_diffrence = toHoursAndMinutes(rep[r].time_total);

                    }
                   
                    setAllData(rep);
                    document.querySelector('#csv').click();
                }
            });
    }

    const csvReport = {
        data: Alldata,
        headers: header,
        filename: filename
    };
    const copy = [...totalJobs];
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
            setTotalJobs(sortData);
            setOrder('DESC');
        }
        if(order == 'DESC'){
            const sortData = [...copy].sort((a, b) => (a[col] < b[col] ? -1 : 1));
            setTotalJobs(sortData);
            setOrder('ASC');
        }
        
    }
    const filterJobs = (e) => {
       filterJobs1();
    }

    const filterJobDate = (w) => {
        $('#filter-week').val(w)
        filterJobs1();
    }
    const filterJobs1 = () => {
        let filter_value = $('#search-field').val();
        let filter_week = $('#filter-week').val();
        axios
            .get(`/api/admin/jobs?filter_week=${filter_week}&q=${filter_value}`, { headers })
            .then((response) => {
                if (response.data.jobs.data.length > 0) {
                    setTotalJobs(response.data.jobs.data);
                    setPageCount(response.data.jobs.last_page);
                } else {
                    setTotalJobs([]);
                    setPageCount(response.data.jobs.last_page);
                    setLoading("No Jobs found");
                }
            })
    }

    const allShifts = [

            { bg: '#d3d3d3', tc: '#444',  shift: 'fullday-8am-16pm' },
            { bg: '#FFE87C', tc: '#444',  shift: 'morning1-8am-10am' },
            { bg: '#FFAE42', tc: '#fff',  shift: 'morning2-10am-12pm' },
            { bg: 'yellow',  tc: '#444',  shift: 'morning-8am-12pm' },
            { bg: '#79BAEC', tc: '#fff',  shift: 'noon1-12pm-14pm' },
            { bg: '#1569C7', tc: '#fff',  shift: 'noon2-14pm-16pm' },
            { bg: '#ADDFFF', tc: '#fff',  shift: 'noon-12pm-16pm' },
            { bg: '#DBF9DB', tc: '#444',  shift: 'evening1-16pm-18pm' },
            { bg: '#3EA055', tc: '#fff',  shift: 'evening2-18pm-20pm' },
            { bg: '#B5EAAA', tc: '#fff',  shift: 'evening-16pm-20pm' },
            { bg: '#B09FCA', tc: '#fff',  shift: 'night1-20pm-22pm' },
            { bg: '#800080', tc: '#fff',  shift: 'night2-22pm-24pm' },
            { bg: '#D2B9D3', tc: '#fff',  shift: 'night-20pm-24pm' },

            { bg: 'yellow',  tc: '#444',  shift: 'morning' },
            { bg: '#79BAEC', tc: '#fff',  shift: 'noon' },
            { bg: '#DBF9DB', tc: '#444',  shift: 'evening' },
            { bg: '#B09FCA', tc: '#fff',  shift: 'night' }
    ];


   
    return (
        <div id="container">
            <Sidebar />
            <div id="content" className="job-listing-page">
                <div className="titleBox customer-title">
                    <div className="row">
                        <div className="col-sm-2 col-4">
                            <h1 className="page-title">Jobs</h1>
                        </div>
                       
                        <div className="col-sm-7 hidden-xs">
                            <div className="job-buttons">
                                <input type="hidden" id="filter-week" />
                                <button className="btn btn-info" onClick={(e)=>{filterJobDate('all');setFilter(e.target.value)}} style={{background: "#858282", borderColor: "#858282"}}> All Jobs</button>
                                <button className="ml-2 btn btn-success" onClick={(e)=>{filterJobDate('current')}}> Current week</button>
                                <button className="ml-2 btn btn-pink" onClick={(e)=>{filterJobDate('next')}}> Next week</button>
                                <button className="ml-2 btn btn-primary" onClick={(e)=>{filterJobDate('nextnext')}}> Next Next week</button>
                                <button className="ml-2 btn btn-warning addButton"  data-toggle="modal" data-target="#exampleModal">Export Time Reports</button>
                            </div>
                            <div classname="App" style={{ display: "none" }}>
                                <CSVLink {...csvReport} id="csv">Export to CSV</CSVLink> 
                            </div>
                        </div>
                        <div className="col-12 hidden-xl">
                            <div className="job-buttons">
                                <input type="hidden" id="filter-week" />
                                <button className="btn btn-info" onClick={(e)=>{filterJobDate('all')}} style={{background: "#858282", borderColor: "#858282"}}> All Jobs</button>
                                <button className="ml-2 btn btn-success" onClick={(e)=>{filterJobDate('current')}}> Current week</button>
                                <button className="ml-2 btn btn-pink" onClick={(e)=>{filterJobDate('next')}}> Next week</button>
                                <button className="btn btn-primary" onClick={(e)=>{filterJobDate('nextnext')}}> Next Next week</button>
                                <button className="ml-2 reportModal btn btn-warning"  data-toggle="modal" data-target="#exampleModal">Export Time Reports</button> 
                            </div>
                        </div>
                        <div className="col-sm-3 hidden-xs">
                            <div className="search-data"> 
                               <input type='text' id="search-field" className="form-control" placeholder="Search" onChange={filterJobs} style={{marginRight: "0"}} />
                            </div>
                        </div>

                        <div className='col-sm-6 hidden-xl mt-4'>
                          <select className='form-control' onChange={e => sortTable(e,e.target.value)}>
                          <option selected>-- Sort By--</option>
                           <option value="start_date">Job Date</option>
                           <option value="status">Status</option>
                          </select>
                        </div>

                    </div>
                </div>
                <div className="card">
                    <div className="card-body getjobslist">

                        <div className="boxPanel">
                            <div className="table-responsive">
                                {totalJobs.length > 0 ? (
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th scope="col" onClick={(e)=>{sortTable(e,'start_date')}} style={{ "cursor": "pointer" }}>Job Date <span className="arr"> &darr; </span></th>
                                                <th scope="col" >Worker</th>
                                                <th scope="col" >Client</th>
                                                <th scope="col" >Service</th>
                                                <th className="hidden-xs" onClick={(e)=>{sortTable(e,'status')}} style={{ "cursor": "pointer" }} scope="col">Status <span className="arr"> &darr; </span></th>
                                                <th className='text-center' scope="col">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {totalJobs &&
                                                totalJobs.map((item, index) => {
 
                                                    let ix = allShifts.find(function(el, i){
                                                       
                                                          if(item.shifts != null){
                                                          
                                                          if( el.shift.replace(/ /g,'') == item.shifts.replace(/ /g,'')){
                                                           
                                                             return allShifts.indexOf(el.shift);
                                                          }}
                                                    });

                                                    let pstatus = null;
                                                  
                                                    return (
                                                        <tr key={index} style={{ "cursor": "pointer" }}>
                                                            <td onClick={(e) => handleNavigate(e, item.id)} style={(ix != undefined) ? {background: ix.bg, color: ix.tc} : {background: '#d3d3d3', color: '#444'} }>
                                                                <span className="d-block mb-1">{Moment(item.start_date).format('DD-MM-YYYY')}</span>
                                                                <span className="mBlue" >{item.shifts}</span>
                                                            </td>
                                                            <td><Link to={(item.worker) ? `/admin/view-worker/${item.worker.id}` : '#'}>
                                                                <h6>{
                                                                    item.worker
                                                                        ? item.worker.firstname +
                                                                        " " + item.worker.lastname
                                                                        : "NA"
                                                                }</h6>
                                                            </Link>
                                                            <select name={item.id} className="form-control mb-3 mt-1" value={(workers[`${item.id}`]) ? workers[`${item.id}`] : ""} onFocus={e => handleChange(e, index)} onChange={(e)=>upWorker(e,index)} >
                                                                <option selected>select</option>
                                                                { ( Aworker.length > 0  ) ?
                                                                Aworker && Aworker.map((w, i) => {
                                                                    return (
                                                                        <option value={w.id} key={i}> {w.firstname}  {w.lastname}</option>
                                                                    )
                                                                }):
                                                                <option>No worker Match</option>
                                                                }
                                                            </select>
                                                            </td>
                                                            <td style={item.client ? {background:item.client.color} : {}}><Link to={item.client ? `/admin/view-client/${item.client.id}` : '#'}>{
                                                                item.client
                                                                    ? item.client.firstname +
                                                                    " " + item.client.lastname
                                                                    : "NA"
                                                            }
                                                            </Link>
                                                            </td>
                                                            <td onClick={(e) => handleNavigate(e, item.id)}>{
                                                                
                                                                    item.jobservice && item.jobservice.map((js,i)=>{
                                                                       
                                                                        return (
                                                                            (item.client && item.client.lng  == 'en')
                                                                                ? (js.name + " ")
                                                                                :
                                                                                (js.heb_name + " ")
                                                                        )
                                                                    })
                                                                
                                                               

                                                            }</td>
                                                            <td style={ item.status.includes('cancel') ? {color:'red',textTransform:"capitalize"} : {textTransform:"capitalize"}} className="hidden-xs"
                                                              
                                                            >
                                                                {item.status}
                                                               
                                                                {
                                                                    item.order && item.order.map((o,i)=>{

                                                                        return (<> <br/><Link target='_blank' to={o.doc_url} className="jorder"> order -{o.order_id} </Link><br/></>);
                                                                    })
                                                                }

                                                                {
                                                                    item.invoice && item.invoice.map((inv,i)=>{

                                                                        if( i == 0 ){ pstatus = inv.status; }

                                                                        return (<> <br/><Link target='_blank' to={inv.doc_url} className="jinv"> Invoice -{inv.invoice_id} </Link><br/></>);
                                                                    })
                                                                }

                                                                {
                                                                    pstatus != null && <> <br/><span class='jorder'>{ pstatus }</span><br/></>
                                                                }

                                                                <p>
                                                                {(item.status=='cancel' && item.rate != null)?`(With Cancellatiom fees ${item.rate} ILS)`:''}
                                                                </p>
                                                            </td>
                                                           
                                                            <td className='text-center'>
                                                                <div className="action-dropdown dropdown pb-2">
                                                                    <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown">
                                                                        <i className="fa fa-ellipsis-vertical"></i>
                                                                    </button>
                                                                 
                                                                 {item.client && <div className="dropdown-menu">
                                                                    { (item.client) && item.invoice.length == 0 && <Link to={`/admin/add-order?j=${item.id}&c=${item.client.id}`} className="dropdown-item">Create Order</Link>}
                                                                    { (item.client) && item.order.length > 0 && <Link to={`/admin/add-invoice?j=${item.id}&c=${item.client.id}`} className="dropdown-item">Create Invoice</Link>}
                                                                        <Link to={`/admin/view-job/${item.id}`} className="dropdown-item">View</Link>
                                                                        <button className="dropdown-item" onClick={() => handleDelete(item.id)}>Delete</button>
                                                                    </div>
                                                                 }
                                                                </div>
                                                                <button type="button" style={{ display: 'none' }} className="btn btn-success" onClick={(e) => handleform(item.id, e)}>
                                                                    Update
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="text-center mt-5">{loading}</p>
                                )}
                                {totalJobs.length > 0 ? (
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

                        <div className="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="exampleModalLabel">Export Records</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">


                                        <div className="row">
                                           
                                            <div className="col-sm-12">
                                                <div className="form-group">
                                                    <label className="control-label">
                                                        From
                                                    </label>
                                                    <input
                                                        type="date"
                                                        onChange={(e) =>
                                                            setFrom(e.target.value)
                                                        }
                                                        className="form-control"
                                                        required

                                                    />

                                                </div>
                                            </div>

                                            <div className="col-sm-12">
                                                <div className="form-group">
                                                    <label className="control-label">
                                                        To
                                                    </label>
                                                    <input
                                                        type="date"
                                                        onChange={(e) =>
                                                            setTo(e.target.value)
                                                        }
                                                        className="form-control"
                                                        required

                                                    />

                                                </div>
                                            </div>


                                        </div>


                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary closeb" data-dismiss="modal">Close</button>
                                        <button type="button" onClick={(e)=> handleReport(e)} className="btn btn-primary">Export</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

import React,{useState,useEffect} from 'react'
import { useAlert } from "react-alert";
import { useParams,useNavigate,Link } from "react-router-dom";
import ReactPaginate from "react-paginate";

export default function PastJob() {
    const [jobs, setJobs] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [loading, setLoading] = useState("Loading...");
    const [errors, setErrors] = useState([])
    const params = useParams();
    const navigate = useNavigate();
    const alert = useAlert();
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };

    const getWorkerJobs = () => {
         const data = {
        "wid": params.id,
        "status": true
    }
        axios.post("/api/admin/get-worker-jobs",data, { headers }).then((response) => {
            if (response.data.jobs.data.length > 0) {
                setJobs(response.data.jobs.data);
                setPageCount(response.data.jobs.last_page);
            } else {
                setLoading("No Jobs found");
            }
        });
    };
    useEffect(() => {
        getWorkerJobs();
    }, []);
     const handlePageClick = async (data) => {
        let currentPage = data.selected + 1;
        const raw_data = {
        "wid": params.id,
        "status": true
    }
        axios
            .post("/api/admin/get-worker-jobs?page=" + currentPage,raw_data, { headers })
            .then((response) => {
                if (response.data.jobs.data.length > 0) {
                    setJobs(response.data.jobs.data);
                    setPageCount(response.data.jobs.last_page);
                } else {
                    setLoading("No Employer found");
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
                            getWorkerJobs();
                        }, 1000);
                    });
            }
        });
    };

    const copy = [...jobs];
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
            setJobs(sortData);
            setOrder('DESC');
        }
        if(order == 'DESC'){
            const sortData = [...copy].sort((a, b) => (a[col] < b[col] ? -1 : 1));
            setJobs(sortData);
            setOrder('ASC');
        }
        
    }

  return (
    <div className="boxPanel">
         <div className="boxPanel">
                            <div className="table-responsive">
                                {jobs.length > 0 ? (
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                               <th onClick={(e)=>sortTable(e,'id')} style={{cursor:'pointer'}} >ID  <span className='arr'> &darr; </span></th>
                                                <th>Client Name</th>
                                                <th>Service Name</th>
                                                <th onClick={(e)=>sortTable(e,'start_date')} style={{cursor:'pointer'}}>Date  <span className='arr'> &darr; </span></th>
                                                <th onClick={(e)=>sortTable(e,'shifts')} style={{cursor:'pointer'}}>Shift  <span className='arr'> &darr; </span></th>
                                                <th>Total</th>
                                                <th onClick={(e)=>sortTable(e,'status')} style={{cursor:'pointer'}}>Status  <span className='arr'> &darr; </span></th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {jobs &&
                                                jobs.map((item, index) => {
                                                    let total = 0;
                                                    return(
                                                    <tr key={index}>
                                                        <td>{item.id}</td>
                                                        <td>
                                                            {
                                                            item.client
                                                                ? item.client.firstname +
                                                                " " + item.client.lastname
                                                                : "NA"
                                                            }
                                                        </td>
                                                        <td>{
                                                            item.jobservice && item.jobservice.map((js,i)=>{
                                                              total += parseInt(js.total);
                                                              return(
                                                                js.name
                                                                ? js.name
                                                                : "NA"
                                                              )    
                                                            })
                                                           
                                                            }</td>
                                                        <td>
                                                            {item.start_date}
                                                        </td>
                                                        <td>
                                                            {item.shifts}
                                                        </td>
                                                        <td>
                                                            {total} ILS + VAT
                                                        </td>
                                                       <td
                                                            style={{
                                                                textTransform:
                                                                    "capitalize",
                                                            }}
                                                        >
                                                            {item.status}
                                                        </td>
                                                        <td>
                                                            <div className="d-flex">
                                                                <Link
                                                                    to={`/admin/edit-job/${item.id}`}
                                                                    className="btn bg-green"
                                                                >
                                                                    <i className="fa fa-edit"></i>
                                                                </Link>
                                                                
                                                                <Link
                                                                    to={`/admin/view-job/${item.id}`}
                                                                    className="ml-2 btn btn-warning"
                                                                >
                                                                    <i className="fa fa-eye"></i>
                                                                </Link>
                                                                <button 
                                                                className="ml-2 btn bg-red"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        item.id
                                                                    )
                                                                }
                                                                >
                                                                    <i className="fa fa-trash"></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )})}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="text-center mt-5">{loading}</p>
                                )}
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
                                ) : (
                                    <></>
                                )}
                            </div>
                        </div>
    </div>
  )
}

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from '../../Layouts/Sidebar'
import ClientDetails from '../../Components/Job/ClientDetails'
import WorkerDetails from '../../Components/Job/WorkerDetails'
import Services from '../../Components/Job/Services'
import Comment from '../../Components/Job/Comment'
import WorkerTiming from '../../Components/Job/WorkerTiming'
import axios from 'axios';

export default function ViewJob() {
    const params = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState([]);
    const [client, setClient] = useState([]);
    const [worker, setWorker] = useState([]);
    const [services, setServices] = useState([]);
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };

    const getJob = () => {
        axios
            .get(`/api/admin/jobs/${params.id}`, { headers })
            .then((res) => {
                const r = res.data.job;
                setJob(r)
                setClient(r.client);
                setWorker(r.worker);
                setServices(r.jobservice);
            });
    }

    const cancelJob = (e) => {
        e.preventDefault();
        Swal.fire({
            title: 'Are you sure ?',
            text: 'You won\'t be revert this',
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Yes, Cancel it',
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .post(`/api/admin/cancel-job`, { id: params.id }, { headers })
                    .then((response) => {
                        Swal.fire(
                            'Job cancelled succesfully',
                            '',
                            "success"
                        );
                        setTimeout(() => {
                            getJob();
                        }, 1000);
                    });
            }
        });

    }
    useEffect(() => {
        getJob();
        setTimeout(()=>{
            document.querySelector('.cdiv').style.display = 'block'
        },1000);
    }, []);
    const handleClick = () => {
        navigate(`/admin/jobs`);
    }
    
    return (
        <div id='container'>
            <Sidebar />
            <div id="content">
                <div className='view-applicant'>
                    <div className='worker-profile'>
                        <div className="row">
                            <div className="col-sm-6">
                                <ClientDetails client={client} />
                            </div>
                            <div className="col-sm-6">
                                <div className='cdiv' style={{display:'none'}}>
                                {
                                    (job.status != 'completed' ) ? 

                                    (job.status == 'cancel') ?
                                        <h4 className='text-danger float-right font-weight-bold mt-2'> Cancelled </h4>
                                        :  <button className='btn btn-danger float-right mt-2' onClick={(e) => cancelJob(e)}>Cancel</button>
                                    :<h4 className='text-success float-right font-weight-bold mt-2'> Completed </h4>
                                }
                                </div>

                                <WorkerDetails worker={worker} job={job} />
                            </div>
                            <div className="col-sm-12">
                                <Services services={services} job={job} />
                                <WorkerTiming job={job} />
                                <Comment />

                            </div>
                            <div className="col-sm-12 text-center">
                                <button type="button" onClick={handleClick} className="btn btn-pink addButton">
                                    Back
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    )
}

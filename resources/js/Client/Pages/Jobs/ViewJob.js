import React, { useState, useEffect, useTransition } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from '../../Layouts/ClientSidebar'
import WorkerDetails from '../../Component/Job/WorkerDetails'
import Services from '../../Component/Job/Services'
import Comment from '../../Component/Job/Comment'
import moment from 'moment-timezone';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';
import { Base64 } from "js-base64";

export default function ViewJob() {
    const params = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState([]);
    const [job_status, setJobStatus] = useState('completed');
    const [client, setClient] = useState([]);
    const [worker, setWorker] = useState([]);
    const [services, setServices] = useState([]);
    const [total, setTotal] = useState(0);
    const {t} = useTranslation();
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("client-token"),
    };

    const getJob = () => {
        axios
            .post(`/api/client/view-job`,{id:Base64.decode(params.id)}, { headers })
            .then((res) => {
                const r = res.data.job[0];
                setJob(r)
                setJobStatus(r.status);
                setClient(r.client);
                setWorker(r.worker);
                setTotal(r.jobservice[0].total);
                setServices(r.jobservice);
            });
    }
    useEffect(() => {
        getJob();
    }, []);
    const handleClick = () => {
        navigate(`/client/jobs`);
    }
    const HandleCancelJob = () => {
         let Job_start_time = moment(job.start_date + ' ' + job.start_time);
         let currentTime = moment();

         let time_diff = Job_start_time.diff(currentTime,'h');
         let warning_text ='';
         let new_total=total;
         if(time_diff<24){
               warning_text=t('client.jobs.view.cancel_text')   +" ( "+total +" ) "+ t('global.currency');

         }else{
             warning_text=t('client.jobs.view.cancel_text') + " ( "+(total/2)+" ) "+ t('global.currency');
             new_total=total/2;
         }
         let data = {'status':'cancel','total':new_total};

        Swal.fire({
            title: t('client.jobs.view.cancel_warning'),
            text: warning_text,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            cancelButtonText:t('client.jobs.view.cancel'),
            confirmButtonText: t('client.jobs.view.confirm_cancel_btn'),
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .post(`/api/client/update-job-status/${params.id}`,data,{ headers })
                    .then((response) => {
                        Swal.fire(
                            t('client.jobs.view.updated'),
                            t('client.jobs.view.updated_msg'),
                            "success"
                        );
                        setTimeout(() => {
                            getJob();
                        }, 1000);
                    });
            }
        });

    }
    return (
        <div id='container'>
            <Sidebar />
            <div id="content">
                <div className='view-applicant client-view-job'>
                    <div className='worker-profile mt-4'>
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="row">
                                   <div className="col-sm-8 ">
                                      <h2 className="text-custom" style={{ display:'none' }}>{t('client.jobs.view.worker_details')}</h2>
                                    </div>
                                    <div className="col-sm-2 text-right">
                                    {t('client.jobs.view.job_status')} : <h6 className="text-custom" style={{textTransform: "capitalize"}}>{job.status}</h6>
                                    </div>
                                     <div className="col-sm-2">
                                          {(job_status !='completed' && job_status !='cancel') && ( <button type="button" onClick={HandleCancelJob} className="btn btn-danger dangerous">{t('client.jobs.view.cancel')}</button>)}
                                    </div>
                                </div>
                               
                                
                            </div>
                            <div className="col-sm-12">
                                <Services services={services} job={job} />
                                <Comment />

                            </div>
                            <div className="col-sm-12 text-center">
                                <button type="button" onClick={handleClick} className="btn btn-pink addButton">
                                {t('client.jobs.view.back')}
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    )
}

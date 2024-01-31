import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import WorkerSidebar from '../../Layouts/WorkerSidebar'
import ClientDetails from '../../Components/Job/ClientDetails'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import Services from '../../Components/Job/Services'
import Comment from '../../Components/Job/Comment'
import { useAlert } from "react-alert";
import { useTranslation } from 'react-i18next';

export default function WorkerViewJob() {
    const params = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState([]);
    const [job_status, setJobStatus] = useState('completed');
    const [client, setClient] = useState([]);
    const [worker, setWorker] = useState([]);
    const [services, setServices] = useState([]);
    const [counter, setCounter] = useState('00:00:00');
    const [isRunning, setIsRunning] = useState(false);
    const [startTime, setStartTime] = useState(new Date());
    const [time_id, setTimeId] = useState(null);
    const [job_time, setJobTime] = useState([]);
    const [total_time, setTotalTime] = useState(0);
    const alert = useAlert();
    const { t } = useTranslation();
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("worker-token"),
    };

    const getJob = () => {
        axios
            .get(`/api/jobs/${params.id}`, { headers })
            .then((res) => {
                const r = res.data.job;
                setJob(r)
                setJobStatus(r.status);
                setClient(r.client);
                setWorker(r.worker);
                setServices(r.jobservice);
            });
    }
    useEffect(() => {
        getJob();
    }, []);
    const handleClick = () => {
        navigate(`/worker/jobs`);
    }
    const HandleMarkComplete = () => {
        let data = [];
        (isRunning) ? stopTimer() : '';
       const cbtn =  document.querySelector('.cmbtn');
       cbtn.setAttribute('disabled',true);
       cbtn.value = 'please wait ...'
        axios
            .put(`/api/jobs/${params.id}`, data, { headers })
            .then((res) => {
                alert.success('Job Mark as Completed.');
                getJob();
            });

    }
    const getDateTime = () => {
        var now = new Date();
        var year = now.getFullYear();
        var month = now.getMonth() + 1;
        var day = now.getDate();
        var hour = now.getHours();
        var minute = now.getMinutes();
        var second = now.getSeconds();
        if (month.toString().length == 1) {
            month = '0' + month;
        }
        if (day.toString().length == 1) {
            day = '0' + day;
        }
        if (hour.toString().length == 1) {
            hour = '0' + hour;
        }
        if (minute.toString().length == 1) {
            minute = '0' + minute;
        }
        if (second.toString().length == 1) {
            second = '0' + second;
        }
        var dateTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
        return dateTime;
    }
    const startTimer = () => {
        setCounter('00:00:00');
        setIsRunning(true);
        let data = {
            job_id: params.id,
            worker_id: localStorage.getItem("worker-id"),
            start_time: getDateTime()
        };
        axios
            .post(`/api/job-start-time`, data, { headers })
            .then((res) => {
                getTime();
            });
    };
    const stopTimer = () => {
        setIsRunning(false);
        setStartTime(getDateTime());
        let data = {
            id: time_id,
            time_diff: (new Date(getDateTime()).getTime() - new Date(startTime).getTime()) / 1000,
            end_time: getDateTime()
        };
        axios
            .post(`/api/job-end-time`, data, { headers })
            .then((res) => {
                getTimes();

            });
    };
    const getTime = () => {
        let data = {
            job_id: params.id,
            worker_id: localStorage.getItem("worker-id"),
            filter_end_time: true
        };
        axios
            .post(`/api/get-job-time`, data, { headers })
            .then((res) => {
                let t = res.data.time;
                if (t) {
                    if (Object.keys(t).length) {
                        setTimeId(t.id);
                        setStartTime(t.start_time);
                        setIsRunning(true);
                    }
                }

            });


    }
    const getTimes = () => {
        let data = {
            job_id: params.id,
            worker_id: localStorage.getItem("worker-id")
        };
        axios
            .post(`/api/get-job-time`, data, { headers })
            .then((res) => {
                let t = res.data;
                setJobTime(t.time);
                setTotalTime(parseInt(t.total));
            });


    }
    useEffect(() => {
        getTimes();
        getTime();

    }, []);
    useEffect(() => {
        const interval = setInterval(() => {
            let timeDiff = (new Date().getTime() - new Date(startTime).getTime()) / 1000;
            timeDiff = timeDiff + total_time;
            let hours = Math.floor(timeDiff / 3600);
            let minutes = Math.floor((timeDiff % 3600) / 60);
            let seconds = Math.floor(timeDiff % 60);
            hours = (hours < 10) ? '0' + hours : hours;
            minutes = (minutes < 10) ? '0' + minutes : minutes;
            seconds = (seconds < 10) ? '0' + seconds : seconds;
            setCounter(`${hours}h:${minutes}m:${seconds}s`);
        }, 1000);
        return () => clearInterval(interval);
    }, [startTime]);

    let time_difference = (start, end) => {
        const timeDiff = (new Date(end).getTime() - new Date(start).getTime()) / 1000;
        return calculateTime(timeDiff);

    }
    let calculateTime = (timeDiff) => {
        let hours = Math.floor(timeDiff / 3600);
        let minutes = Math.floor((timeDiff % 3600) / 60);
        let seconds = Math.floor(timeDiff % 60);
        hours = (hours < 10) ? '0' + hours : hours;
        minutes = (minutes < 10) ? '0' + minutes : minutes;
        seconds = (seconds < 10) ? '0' + seconds : seconds;
        return `${hours}h:${minutes}m:${seconds}s`;

    }

    return (
        <div id='container'>
            <WorkerSidebar />
            <div id="content">
                <div className='view-applicant'>
                    <div className='worker-profile worker-view-job'>
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="row mb-3 mt-4">
                                    <div className='col-sm-8 col-12'>
                                        <h2 className="text-custom">{t('worker.jobs.view.c_details')}</h2>
                                    </div>
                                    <div className='col-sm-2 col-6'>
                                        {(job_status != 'completed' && job_status != 'cancel') && (<button type="button" onClick={HandleMarkComplete} className="btn btn-success cmbtn">{t('worker.jobs.view.completebtn')}</button>)}
                                    </div>
                                    {(job_status != 'completed' && job_status != 'cancel') ?
                                        <div className='col-sm-2 col-6'>
                                            {!isRunning && (
                                                <>
                                                    <button onClick={startTimer} className="btn btn-primary">{job_time.length > 0 ? t('worker.jobs.view.resbtn') : t('worker.jobs.view.startbtn')}</button>
                                                    <h4>{job_time.length > 0 ? calculateTime(total_time) : ''}</h4>
                                                </>
                                            )}
                                            {isRunning && (
                                                <>

                                                    <button onClick={stopTimer} className="btn btn-danger dangerous">{t('worker.jobs.view.stopbtn')}</button>
                                                    <h4>{counter}</h4>
                                                </>
                                            )}
                                        </div>
                                        :
                                        <div className='col-sm-2'>
                                            {t('worker.jobs.view.job_status')} : <h6 className="text-custom">{job.status}</h6>
                                        </div>
                                    }
                                </div>

                                <ClientDetails client={client} />
                            </div>
                            <div className="col-sm-12">
                                <Services services={services} job={job} />


                            </div>
                            <div className="col-sm-12">
                                <h2 className="text-custom">{t('worker.jobs.view.w_time')}</h2>
                                <div className='dashBox p-4'>
                                    <div className='table-responsive'>
                                        {job_time.length > 0 ? (
                                            <Table className="table table-bordered responsiveTable">
                                                <Thead>
                                                    <Tr>
                                                        <Th scope="col">{t('worker.jobs.view.start_time')}</Th>
                                                        <Th scope="col">{t('worker.jobs.view.end_time')}</Th>
                                                        <Th scope="col">{t('worker.jobs.view.time')}</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {job_time &&
                                                        job_time.map((item, index) => {
                                                            let w_t = (item.end_time) ? time_difference(item.start_time, item.end_time) : '';
                                                            return (
                                                                <Tr key={index}>
                                                                    <Td>{item.start_time}</Td>
                                                                    <Td>{item.end_time}</Td>
                                                                    <Td>{w_t}</Td>
                                                                </Tr>

                                                            )
                                                        })}
                                                    <Tr>
                                                        <Td colSpan="2">{t('worker.jobs.view.total_time')}</Td>
                                                        <Td>{calculateTime(total_time)}</Td>
                                                    </Tr>
                                                </Tbody>

                                            </Table>
                                        ) : (
                                            <p className="text-center mt-5">{t('worker.jobs.view.timing_not')}</p>
                                        )}
                                    </div>
                                </div>
                                <Comment />
                            </div>
                            <div className="col-sm-12 text-center">
                                <button type="button" onClick={handleClick} className="btn btn-pink addButton">
                                    {t('worker.jobs.view.back')}
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    )
}

import React, { useState } from 'react'

export default function JobFilter({AllServices,AllClients,AllWorkers,getTotalJobs}) {

    const [service, setService] = useState('');
    const [worker, setWorker]   = useState('');  
    const [client,setClient]    = useState('');
    const [status, setStatus]   = useState('');

    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };
    const handleFilter = () => {
        axios.get("/api/admin/jobs?service="+service+"&client="+client+"&worker="+worker+"&status="+status, { headers }).then((response) => {           
                getTotalJobs(response);
        });
    }

    const handleReset = () => {
        setService('');
        setClient('');
        setWorker('');
        setStatus('')
        axios.get("/api/admin/jobs", { headers }).then((response) => {
            getTotalJobs(response);
        });
    }

  return (
    <>
        <div className="row colFive">
            <div className="col-sm-3">
                <div className="form-group">
                <label className="control-label">Client Name</label>
                <select className="form-control" name="client"  onChange={(e) => setClient(e.target.value)}>
                <option value="">Please Select</option>
                {AllClients && AllClients.map((c,i)=>{
                    return <option value={c.id}> {c.firstname+" "+c.lastname} </option>
                })}
                </select>
                </div>
            </div>
            <div className="col-sm-3">
                <div className="form-group">
                <label className="control-label">Worker Name</label>
                <select className="form-control" name="worker"  onChange={(e) => setWorker(e.target.value)}>
                <option value="">Please Select</option>
                    {AllWorkers && AllWorkers.map((w,i)=>{
                        return <option value={w.id}> {w.firstname+" "+w.lastname} </option>
                    })}
                </select>
                </div>
            </div>
            <div className="col-sm-3">
                <div className="form-group">
                <label className="control-label">Service Name</label>
                <select className="form-control" name="service" onChange={(e) => setService(e.target.value)}>
                    <option value="">Please Select</option>
                    { AllServices && AllServices.map((s,i)=>{
                        return <option value={s.id}> {s.name} </option>
                    })}
                </select>
                </div>
            </div>
            <div className="col-sm-3">
                <div className="form-group">
                <label className="control-label">Status</label>
                <select className="form-control" name="status" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="">Please Select</option>
                    <option value="not-started">Not Started</option>
                    <option value="progress">Progress</option>
                    <option value="completed">Completed</option>
                </select>
                </div>
            </div>
            <div className="col-sm-3">
                <label className="control-label">&nbsp;</label>
                <div className="d-flex">
                <button className="btn bg-purple filterBtn" onClick={handleFilter}>
                    <i className="fas fa-search"></i>
                </button>
                <button className="btn btn-danger ml-1 filterBtn" onClick={handleReset}>
                    <i className="fas fa-undo"></i>
                </button>
                </div>
            </div>
        </div>
    </>
  )
}

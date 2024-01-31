import React, { useState , useEffect} from 'react'
import Sidebar from '../../Layouts/Sidebar'
import { SelectPicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import axios from 'axios';
import { useAlert } from 'react-alert';
import { useNavigate } from 'react-router-dom';

export default function AddJob() {
    const alert                        = useAlert();
    const navigate                     = useNavigate();
    const [service, setService]        = useState('');
    const [client, setClient]          = useState('');
    const [worker, setWorker]          = useState('');
    const [startDate, setStartDate]    = useState('');
    const [endDate, setEndDate]        = useState('');
    const [startTime, setStartTime]    = useState('');
    const [endTime, setEndTime]        = useState('');
    const [rate, setRate]              = useState('');
    const [instruction,setInstruction] = useState('');
    const [address, setAddress]        = useState('');
    const [status, setStatus]          = useState('');
    const [schedule, setSchedule]   = useState('');

    const [AllClients,setAllClients]   = useState([]);
    const [AllServices,setAllServices] = useState([]);
    const [AllWorkers,setAllWorkers]   = useState([]);
    const [AllSchedules,setAllSchedules]   = useState([]);
    
    
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            job_id:service,
            client_id:client,
            worker_id:worker,
            start_date:startDate,
            start_time:startTime,
            end_time:endTime,
            schedule:schedule,
            rate:rate,
            instruction:instruction,
            address:address,
            status:status
        };
        axios
        .post(`/api/admin/jobs`,data,{headers})
        .then((res)=>{
            if(res.data.error){
                for (let e in res.data.error){
                    alert.error(res.data.error[e]);
                }
                } else {
                alert.success(res.data.message);
                setTimeout(()=>{
                    navigate('/admin/jobs');
                },1000);
                
                }
        });
    }

    const getClients = () =>{
       axios
       .get('/api/admin/all-clients',{headers})
       .then((res)=>{
         setAllClients(res.data.clients);
       })
       
    }

    const getServices = () =>{
        axios
        .get('/api/admin/all-services',{headers})
        .then((res)=>{
          setAllServices(res.data.services);
        })
     }

     const getWorkers = () =>{
        axios
        .get('/api/admin/all-workers',{headers})
        .then((res)=>{
          setAllWorkers(res.data.workers);
        })
     }
    
     const getSchedule = () =>{
        axios
        .get('/api/admin/all-service-schedule',{headers})
        .then((res)=>{
            setAllSchedules(res.data.schedules);
        })
     }
    useEffect(()=>{
        getClients();
        getServices();
        getWorkers();
        getSchedule();
    },[]);
    
    const cData = AllClients.map((c,i)=>{
       return {value:c.id,label:(c.firstname+' '+c.lastname)}; 
    });
    const sData = AllServices.map((s,i)=>{
        return {value:s.id,label:(s.name)}; 
    });
    const wData = AllWorkers.map((w,i)=>{
        return {value:w.id,label:(w.firstname+' '+w.lastname)}; 
    });
    const scData = AllSchedules.map((sc,i)=>{
        return {value:sc.id,label:sc.name}; 
    });

  return (
    <div id="container">
        <Sidebar/>
        <div id="content">
            <div className="edit-customer">
                <h1 className="page-title editJob">Add Job</h1>
                <div className='card'>
                    <div className='card-body'>
                        <form onSubmit={handleSubmit}>
                        
                            <div className="form-group">
                                <label className="control-label">Client Name</label>
                                <SelectPicker data={cData} value={client} onChange={(value,event)=>setClient(value)} size="lg" required/>
                            </div>
                            <div className="form-group">
                                <label className="control-label">Worker Name</label>
                                <SelectPicker data={wData} value={worker} onChange={(value,event)=>setWorker(value)} size="lg" required/>
                            </div>
                            <div className="form-group">
                                <label className="control-label">Service Name</label>
                                <SelectPicker data={sData} value={service} onChange={(value,event)=>setService(value)} size="lg" required/>
                            </div>
                            <div className="form-group">
                                <label className="control-label">Job Schedule</label>
                                <SelectPicker data={scData} value={schedule} onChange={(value,event)=>setSchedule(value)} size="lg" required/>
                            </div>
                            <div className="form-group">
                                <label className="control-label">Instruction</label>
                                <textarea value={instruction} onChange={(e) => setInstruction(e.target.value)} className="form-control" placeholder="Instruction"/>
                            </div>
                         
                            <div className="form-group">
                                <label className="control-label">Total Cost</label>
                                <input type="number" step="0.1" value={rate} required onChange={(e) => setRate(e.target.value)} className='form-control' placeholder="Total Cost"/>
                            </div>
                                
                            <div className='row'>
                                <div className='col-sm-4'>
                                    <div className="form-group">
                                        <label className="control-label">Start Date</label>
                                        <input type="date" value={startDate} required onChange={(e) => setStartDate(e.target.value)} className='form-control' />
                                    </div>
                                </div>
                                <div className='col-sm-4'>
                                    <div className="form-group">
                                        <label className="control-label">Start Time</label>
                                        <input type="time" value={startTime} required onChange={(e) => setStartTime(e.target.value)} className='form-control' />
                                    </div>
                                </div>
                                <div className='col-sm-4'>
                                    <div className="form-group">
                                        <label className="control-label">End Time</label>
                                        <input type="time" value={endTime} required onChange={(e) => setEndTime(e.target.value)} className='form-control' />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="control-label">Area/Location *</label>
                                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="form-control" placeholder="Complete Address"/>
                            </div> 
                            <div className="form-group">
                                <label className="control-label">Status</label>
                                <select className="form-control" value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option>Please Select</option>
                                    <option value="not-started">Not Started</option>
                                    <option value="progress">Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                            <div className="form-group text-right">
                                <input type='submit' value='Save and Send' onClick={handleSubmit} className="btn btn-pink saveBtn"/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

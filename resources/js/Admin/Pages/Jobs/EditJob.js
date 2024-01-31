import React, { useState , useEffect} from 'react'
import Sidebar from '../../Layouts/Sidebar'
import { SelectPicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import axios from 'axios';
import { useAlert } from 'react-alert';
import { useNavigate,useParams } from 'react-router-dom';
import TeamAvailability from '../../Components/Job/TeamAvailability';


export default function AddJob() {
    const alert                        = useAlert();
    const navigate                     = useNavigate();
    const params                       = useParams();
    const [services, setServices]      = useState([]);
    const [client, setClient]          = useState('');
    const [address, setAddress]          = useState('');

    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };

    const getJob = () =>{
        axios
        .get(`/api/admin/jobs/${params.id}/edit`,{headers})
        .then((res)=>{
            const r = res.data.job;
            setClient(r.client.firstname+' '+r.client.lastname);
            setAddress(r.client.geo_address);
            setServices(r.jobservice);
        });
    }
     useEffect(()=>{
        getJob();
    },[]);
    
  return (
    <div id="container">
        <Sidebar/>
        <div id="content">
            <div className="edit-customer">
                <h1 className="page-title editJob">Add Job</h1>
                <div id='calendar'></div>
                <div className='card'>
                    <div className='card-body'>
                        <form>     
                            <div className='row'>
                                <div className='col-sm-2'>
                                          <div className='form-group'>
                                            <label>Client</label>
                                            <p>{client}</p>
                                        </div>
                                </div>
                                 <div className='col-sm-2'>
                                          <div className='form-group'>
                                            <label>Services</label>
                                                
                                                 <p>{services ? services.name: 'NA'}</p>
                                        </div>
                                </div>
                                 <div className='col-sm-2'>
                                          <div className='form-group'>
                                            <label>Complete Time</label>
                                             
                                                
                                                 <p>{ services ? services.job_hour+" hours" : 'NA'}</p>
                                        </div>
                                </div>
                                 <div className='col-sm-4'>
                                          <div className='form-group'>
                                            <label>Address</label>
                                            <p>{address}</p>
                                        </div>
                                </div>
                                <div className='col-sm-12'>
                                    <div className='mt-3 mb-3'>
                                        <h3 className='text-center'>Worker Availability</h3>
                                    </div>
                                </div> 
                                <div className='col-sm-12'>
                                    <TeamAvailability/>
                                    <div className='mb-3'>&nbsp;</div>
                                </div>
                            </div>
                            
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

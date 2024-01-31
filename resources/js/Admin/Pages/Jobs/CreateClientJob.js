import React, { useState, useEffect } from 'react'
import Sidebar from '../../Layouts/Sidebar'
import 'rsuite/dist/rsuite.min.css';
import axios from 'axios';
import { useAlert } from 'react-alert';
import { useNavigate, useParams } from 'react-router-dom';
import CreateClientByJob from '../../Components/Job/CreateClientByJob';


export default function CreateClientJob() {
    const alert = useAlert();
    const navigate = useNavigate();
    const params = useParams();
    const [services, setServices] = useState([]);
    const [client, setClient] = useState('');
    const [address, setAddress] = useState('');
    const [selected_service, setSelectedService] = useState(0);

    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };

    const getJob = () => {
        axios
            .get(`/api/admin/get-contract-by-client/${params.id}`, { headers })
            .then((res) => {
                const r = res.data.contract;
                setClient(res.data.client.firstname + ' ' + res.data.client.lastname);
                setAddress(res.data.client.geo_address);
                let data=[];
                let new_data=[];
                r.map((c)=>{
                    
                   new_data=JSON.parse(c.offer.services);
                   new_data = new_data.filter((n)=>{
                         n["c_id"] =c.id
                         return n
                   });
                    Array.prototype.push.apply(data,new_data)
                })
                setServices(data);
            });
    }
    useEffect(() => {
        getJob();
    }, []);

    (services.length) ? ($('#edit-work-time').modal('show')) : '';    
  return (
    <div id="container">
        <Sidebar/>
        <div id="content">
            <div className="view-applicant">
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
                                            {services &&
                                                services.map((item, index) => {
                                                    if (item.service == '10')
                                                        return (<p className={`services-${index}`}>{item.other_title}</p>)
                                                    else
                                                        return (<p className={`services-${index}`}>{item.name}</p>)

                                                }
                                                )}
                                        </div>
                                    </div>
                                    <div className='col-sm-2'>
                                        <div className='form-group'>
                                            <label>Frequency</label>
                                            {services &&
                                                services.map((item, index) => (

                                                    <p className={`services-${index}`}>{item.freq_name}</p>
                                                )
                                                )}
                                        </div>
                                    </div>
                                    <div className='col-sm-2'>
                                        <div className='form-group'>
                                            <label>Complete Time</label>
                                            {services &&
                                                services.map((item, index) => (

                                                    <p className={`services-${index}`}>{item.jobHours} hours</p>
                                                )
                                                )}
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
                                       <CreateClientByJob />
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

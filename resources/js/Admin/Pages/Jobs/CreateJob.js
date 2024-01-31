import React, { useState, useEffect } from 'react'
import Sidebar from '../../Layouts/Sidebar'
import 'rsuite/dist/rsuite.min.css';
import axios from 'axios';
import { useAlert } from 'react-alert';
import { useNavigate, useParams } from 'react-router-dom';
import CreateJobCalender from '../../Components/Job/CreateJobCalender';


export default function () {
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
            .get(`/api/admin/contract/${params.id}`, { headers })
            .then((res) => {
                const r = res.data.contract;
                setClient(r.client.firstname + ' ' + r.client.lastname);
                setAddress(r.client.geo_address);
                setServices(JSON.parse(r.offer.services));
            });
    }
    useEffect(() => {
        getJob();
    }, []);
    (services.length) ? ($('#edit-work-time').modal('show')) : '';

    // const handleServices = (value) => {
    //    const filtered = services.filter((s)=>{
    //         if(s.service == value){
    //             return s;
    //         }
    //     });
    //    setServices(filtered);
    //    setSelectedService(value);
    //    document.querySelector('.closee').click();
    // } 
    
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
                                                        return (<p className={`services-${item.service}`}>{item.other_title}</p>)
                                                    else
                                                        return (<p className={`services-${item.service}`}>{item.name}</p>)

                                                }
                                                )}
                                        </div>
                                    </div>
                                    <div className='col-sm-2'>
                                        <div className='form-group'>
                                            <label>Frequency</label>
                                            {services &&
                                                services.map((item, index) => (

                                                    <p className={`services-${item.service}`}>{item.freq_name}</p>
                                                )
                                                )}
                                        </div>
                                    </div>
                                    <div className='col-sm-2'>
                                        <div className='form-group'>
                                            <label>Complete Time</label>
                                            {services &&
                                                services.map((item, index) => (

                                                    <p className={`services-${item.service}`}>{item.jobHours} hours</p>
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
                                        <CreateJobCalender />
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

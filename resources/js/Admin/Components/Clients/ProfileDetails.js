import React, { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Moment from 'moment';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Notes from './Notes'
import Files from './Files'

export default function ProfileDetails({ client, offerStatus, scheduleStatus, latestContract }) {

    const navigate = useNavigate();
    const firstname = client.firstname;
    const lastname = client.lastname;
    const email = client.email;
    const phone = (client.phone) ? client.phone.toString().split(",").join(' | ') : '';
    const city = client.city;
    const streetNumber = client.street_n_no;
    const floor = client.floor;
    const Apt = client.apt_no;
    const enterance = client.entrence_code;
    const lang = (client.lng == 'heb') ? 'Hebrew' : 'English';

    let geo_address = (client.geo_address) ? client.geo_address : "NA";
    let cords = (client.latitude && client.longitude) ? client.latitude + "," + client.longitude : "";

    const zip = client.zipcode;
    const passcode = client.passcode;
    const joined = Moment(client.created_at).format('DD/MM/Y') + " " + Moment(client.created_at).format('dddd');

    const cardType = (latestContract) ? latestContract.card_type : '';
    const nameOnCard = (latestContract) ? latestContract.name_on_card : '';
    const or_cvv = (latestContract) ? latestContract.cvv : '';
    const signature = (latestContract) ? <a href={latestContract.card_sign} target="_blank">view</a> : '';
    const param = useParams();

    let scolor = '', ocolor = '';
    if (scheduleStatus == 'pending' || scheduleStatus == 'Not Sent') { scolor = '#7e7e56' }
    if (scheduleStatus == 'confirmed') { scolor = 'green' }
    if (scheduleStatus == 'completed') { scolor = 'lightblue' }
    if (scheduleStatus == 'declined') { scolor = 'red' }

    if (offerStatus == 'sent' || offerStatus == 'Not Sent') { ocolor = '#7e7e56' }
    if (offerStatus == 'accepted') { ocolor = 'green' }
    if (offerStatus == 'declined') { ocolor = 'red' }

    let cstatus = "";
    if (client.status == '0') { cstatus = 'Lead' }
    if (client.status == '1') { cstatus = 'Potential Customer' }
    if (client.status == '2') { cstatus = 'Customer' }


    const handleTab = (e) => {
        e.preventDefault();
        let id = (e.target.getAttribute('id'));
        if (id == "ms")
            document.querySelector('#schedule-meeting').click();
        if (id == "os")
            document.querySelector('#offered-price').click();
        if (id == "cs")
            document.querySelector('#contract').click();

    }

    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };

    const [pass, setPass] = useState(null);
    const [passVal, setPassVal] = useState(null);
   
    const viewPass = () => {
        
        if (!passVal) { window.alert('Please enter your password'); return; }
        axios
            .post(`/api/admin/viewpass`, { id: localStorage.getItem('admin-id'), pass: passVal }, { headers })
            .then((res) => {
                if (res.data.response == false) {
                    window.alert('Wrong password!');
                } else {
                    console.log(passcode);
                    setPass(passcode);
                    document.querySelector('.closePs').click();
                }
            })
    }
    
    useEffect(()=>{
        setTimeout(()=>{
            if(client.latest_contract != 0 && client.latest_contract != undefined){
                let bookBtn = document.querySelector('#bookBtn');
                bookBtn.style.display = 'block';
            }
        },200)
    },[client]);
    
    return (
        <>

            <div className='client-view'>
                <h1><span>#{client.id}</span> {firstname} {lastname}</h1>
                <div className='row'>
                    <div className='col-sm-8'>
                        <div className='ClientHistory dashBox p-4 min-414'>
                            <ul className="nav nav-tabs" role="tablist">
                                <li className="nav-item" role="presentation"><a id="client-details" className="nav-link active" data-toggle="tab" href="#tab-client-details" aria-selected="true" role="tab">Client info</a></li>
                                <li className="nav-item" role="presentation"><a id="note-details" className="nav-link" data-toggle="tab" href="#tab-note-details" aria-selected="false" role="tab">Notes</a></li>
                                <li className="nav-item" role="presentation"><a id="files-tab" className="nav-link" data-toggle="tab" href="#tab-files" aria-selected="false" role="tab">Files</a></li>
                            </ul>
                            <div className='tab-content'>
                                <div id="tab-client-details" className="tab-pane active show" role="tab-panel" aria-labelledby="client-details">
                                    <div className='row'>
                                        <div className='col-sm-4'>
                                            <div className='form-group'>
                                                <label>Color</label>
                                                <span style={{ background: (client.color) ? client.color : "#000", height: "24px", width: "34px", display: "block", borderRadius: "4px", border: "1px solid #e6e8eb" }}>&nbsp;</span>
                                            </div>
                                        </div>
                                        <div className='col-sm-4'>
                                            <div className='form-group'>
                                                <label>Email</label>
                                                <p>{email}</p>
                                            </div>
                                        </div>
                                        <div className='col-sm-4'>
                                            <div className='form-group'>
                                                <label>Phone</label>
                                                <p><a href={`tel:${phone}`}>{phone}</a></p>
                                            </div>
                                        </div>
                                        <div className='col-sm-4'>
                                            <div className='form-group'>
                                                <label>Language</label>
                                                <p>{lang}</p>
                                            </div>
                                        </div>
                                        <div className='col-sm-4'>
                                            <div className='form-group'>
                                                <label>Enterance code</label>
                                                <p>{enterance}</p>
                                            </div>
                                        </div>
                                        <div className='col-sm-4'>
                                            <div className='form-group'>
                                                <label>Login details</label>
                                                <p><span>Email:</span> {email}</p>
                                                <p><span>Password:</span>
                                                    {
                                                        pass == null ?
                                                            <span  style={{ cursor: 'pointer' }} data-toggle="modal" data-target="#exampleModalPass">******** &#128274;</span>
                                                            :
                                                            <span>{pass}</span>
                                                    }
                                                </p>
                                            </div>

                                        </div>
                                        <div className='col-sm-4'>
                                            <div className='form-group'>
                                                <label>Joined on</label>
                                                <p>{joined}</p>
                                            </div>
                                        </div>
                                        <div className='col-sm-4'>
                                            <div className='form-group'>
                                                <label>Google address</label>
                                                <p><a href={`https://maps.google.com?q=${cords}`} target='_blank'>
                                                    {geo_address}</a></p>
                                            </div>

                                        </div>
                                        <div className='col-sm-4'>
                                            <div className='form-group'>
                                                <label>Floor</label>
                                                <p>{floor}</p>
                                            </div>
                                        </div>
                                        <div className='col-sm-4'>
                                            <div className='form-group'>
                                                <label>Apt number or Apt name</label>
                                                <p>{Apt}</p>
                                            </div>
                                        </div>
                                        <div className='col-sm-4'>
                                            <div className='form-group'>
                                                <label>status</label>
                                                <p>{cstatus}</p>
                                            </div>

                                        </div>
                                        <div className='col-sm-12'>
                                            <div className='form-group'>
                                                <p><Link className='btn btn-success' to={`/admin/edit-client/${param.id}`}>Edit client</Link></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div id="tab-note-details" className="tab-pane" role="tab-panel" aria-labelledby="card-details">
                                    <div className='form-group'>
                                        <Notes/>
                                    </div>
                                </div>
                                <div id="tab-files" className="tab-pane" role="tab-panel" aria-labelledby="rejected-tab"><Files/></div>
                            </div>
                        </div>
                    </div>
                    <div className='col-sm-4'>
                        <div className='dashBox p-4'>

                            <div className='form-group'>
                                <label className='d-block'>Meeting Status</label>
                                <span onClick={(e) => handleTab(e)} id="ms" className='dashStatus' style={{ background: scolor, cursor: "pointer" }}>{scheduleStatus}</span>
                            </div>

                            <div className='form-group'>
                                <label className='d-block'>Price Offer</label>
                                <span onClick={(e) => handleTab(e)} id="os" className='dashStatus' style={{ background: ocolor, cursor: "pointer" }}>{offerStatus}</span>
                            </div>

                            <div className='form-group mb-0'>
                                <label className='d-block'>Contract</label>
                                <span onClick={(e) => handleTab(e)} id="cs" className='dashStatus' style={{ background: (latestContract && latestContract.status == 'Signed') ? 'green' : '#7e7e56', "cursor": "pointer" }}>{(latestContract) ? latestContract.status : 'Not Sent'}</span>
                            </div>

                        </div>

                        <div className='buttonBlocks dashBox mt-3 p-4'>
                            <Link to={`/admin/view-schedule/${param.id}`}><i className="fas fa-hand-point-right"></i> 

                            {
                                scheduleStatus == 'Not Sent' || scheduleStatus == 'sent'
                                ? 'Schedule Meeting'
                                : 'Re-schedule Meeting'
                            }
                            
                            </Link>
                            <Link to={`/admin/add-offer?c=${param.id}`}><i className="fas fa-hand-point-right"></i> 
                            {
                                offerStatus == 'Not Sent' || offerStatus == 'sent'
                                ? 'Send Offer'
                                : 'Re-send Offer'
                            }
                            </Link>
                            <Link to={`/admin/create-client-job/${param.id}`} id="bookBtn" style={{display:'none'}} ><i className="fas fa-hand-point-right"></i> Book Client</Link>
                        </div>
                    </div>
                </div>
                <div className="modal fade" id="exampleModalPass" tabindex="-1" role="dialog" aria-labelledby="exampleModalPass" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">

                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="form-group">
                                            <label className="control-label">
                                                Enter your password
                                            </label>
                                            <input
                                                type="password"
                                                onChange={(e) =>
                                                    setPassVal(e.target.value)
                                                }
                                                className="form-control"
                                                required
                                                placeholder="Enter your password"
                                            />

                                        </div>
                                    </div>

                                </div>


                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary closePs" data-dismiss="modal">Close</button>
                                <button type="button" onClick={viewPass} className="btn btn-primary">Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

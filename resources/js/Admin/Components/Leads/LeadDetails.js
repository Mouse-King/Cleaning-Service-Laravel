import React, { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Moment from 'moment';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Notes from './Notes'

export default function LeadDetails({ lead }) {

    const navigate = useNavigate();
    const name = lead.firstname + ' ' + lead.lastname;
    const phone = lead.phone;
    const email = lead.email;
    const meta = lead.meta;
    const lead_status = lead.lead_status ? lead.lead_status.lead_status : 'Pending' ;
    const generated_on = Moment(lead.created_at).format('DD/MM/Y') + " " + Moment(lead.created_at).format('dddd');

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
    const param = useParams();
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };

    return (
        <>

            <div className='client-view'>
                <h1><span>#{lead.id}</span> {name}</h1>
                <div className='row'>
                    <div className='col-sm-8'>
                        <div className='ClientHistory dashBox p-4 min-414'>
                            <ul className="nav nav-tabs" role="tablist">
                                <li className="nav-item" role="presentation"><a id="client-details" className="nav-link active" data-toggle="tab" href="#tab-client-details" aria-selected="true" role="tab">Lead info</a></li>
                                <li className="nav-item" role="presentation"><a id="note-details" className="nav-link" data-toggle="tab" href="#tab-note-details" aria-selected="false" role="tab">Comments</a></li>
                                <li className="nav-item" role="presentation"><a id="intrest-details" className="nav-link" data-toggle="tab" href="#tab-intrest" aria-selected="false" role="tab">Intrested In</a></li>
                                {/* <li className="nav-item" role="presentation"><a id="contact-details" className="nav-link" data-toggle="tab" href="#tab-contact" aria-selected="false" role="tab">First Contacted</a></li> */}
                            </ul>
                            <div className='tab-content'>
                                <div id="tab-client-details" className="tab-pane active show" role="tab-panel" aria-labelledby="client-details">
                                    <div className='row'>
                                        <div className='col-sm-6'>
                                            <div className='form-group'>
                                                <label>Email</label>
                                                <p>{email}</p>
                                            </div>
                                        </div>
                                        <div className='col-sm-6'>
                                            <div className='form-group'>
                                                <label>Phone</label>
                                                <p><a href={`tel:${phone}`}>{phone}</a></p>
                                            </div>
                                        </div>
                                        <div className='col-sm-6'>
                                            <div className='form-group'>
                                                <label>status</label>
                                                <p>{lead_status}</p>
                                            </div>

                                        </div>
                                        <div className='col-sm-6'>
                                            <div className='form-group'>
                                                <label>Generated On</label>
                                                <p>{generated_on}</p>
                                            </div>

                                        </div>
                                        <div className='col-sm-12'>
                                            <div className='form-group'>
                                                <label>Meta</label>
                                                <p>{meta}</p>
                                            </div>

                                        </div>

                                        <div className='col-sm-12'>
                                            <div className='form-group'>
                                                <p><Link className='btn btn-success' to={`/admin/edit-lead/${param.id}`}>Edit lead</Link></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div id="tab-note-details" className="tab-pane" role="tab-panel" aria-labelledby="card-details">
                                    <div className='form-group'>
                                        <Notes />
                                    </div>
                                </div>

                                <div id="tab-intrest" className="tab-pane" role="tab-panel" aria-labelledby="card-details">
                                   
                                    { lead.reply ? (<div className='form-group'>
                                    <div className='col-sm-6'>
                                            <div className='form-group'>
                                                <label>Option</label>

                                                <p>{  lead.reply? ( (lead.reply.message.length < 2) ? lead.reply.message : 'Chat' ) : '' }</p>
                                            </div>
                                        </div>
                                        <div className='col-sm-12'>
                                            <div className='form-group'>
                                                <label>Message</label>
                                                <p>{lead.reply?.msg}</p>
                                            </div>
                                        </div>

                                    </div>)
                                    :(
                                        <p className='text-center form-control'>Data not availabe.</p>
                                    )
                                    
                                }
                                    
                                </div>

                                {/* <div id="tab-contact" className="tab-pane" role="tab-panel" aria-labelledby="card-details">
                                   
                                    { lead.reply ? (<div className='form-group'>
                                    <div className='col-sm-6'>
                                            <div className='form-group'>
                                                <label>Option</label>

                                                <p>{  lead.reply? ( (lead.reply.message.length < 2) ? lead.reply.message : 'Chat' ) : '' }</p>
                                            </div>
                                        </div>
                                        <div className='col-sm-12'>
                                            <div className='form-group'>
                                                <label>Message</label>
                                                <p>{lead.reply?.msg}</p>
                                            </div>
                                        </div>

                                    </div>)
                                    :(
                                        <p className='text-center form-control'>Data not availabe.</p>
                                    )
                                    
                                }
                                    
                                </div> */}

                            </div>
                        </div>
                    </div>
                    <div className='col-sm-4'>
                        <div className='dashBox p-4'>

                            <div className='form-group'>
                                <label className='d-block'>Covert to Client</label>
                                <Link to={`/admin/add-lead-client/${param.id}`} className="btn btn-pink addButton"><i className="btn-icon fas fa-plus-circle"></i>Convert</Link>
                            </div>

                        </div>

                        <div className='dashBox p-4 mt-3'>

                            <div className='form-group'>
                                <label className='d-block'>Meeting Status</label>
                                <span  id="ms" className='dashStatus' style={{ background: '#7e7e56', cursor: "pointer" }}>{lead.latest_meeting?lead.latest_meeting.booking_status:"Not Send"}</span>
                            </div>

                            <div className='form-group'>
                                <label className='d-block'>Price Offer</label>
                                <span id="os" className='dashStatus' style={{ background: '#7e7e56', cursor: "pointer" }}>{lead.latest_offer? lead.latest_offer.status:'Not Send'}</span>
                            </div>

                        </div>

                        <div className='buttonBlocks dashBox mt-3 p-4'>
                            <Link to={`/admin/view-schedule/${param.id}`}><i className="fas fa-hand-point-right"></i> 

                            {
                                lead.meetings?.length == 0 
                                ? 'Schedule Meeting'
                                : 'Re-schedule Meeting'
                            }
                            
                            </Link>
                            <Link to={`/admin/add-offer?c=${param.id}`}><i className="fas fa-hand-point-right"></i> 
                            {
                                lead.offers?.length == 0 
                                ? 'Send Offer'
                                : 'Re-send Offer'
                            }
                            </Link>
                            <Link to={`/admin/create-client-job/${param.id}`} id="bookBtn" style={{display:'none'}} ><i className="fas fa-hand-point-right"></i> Book Client</Link>
                        </div>
                        
                    </div>
                </div>
            </div>
        </>
    )
}

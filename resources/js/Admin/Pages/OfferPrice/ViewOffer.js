import React, { useEffect, useState } from 'react'
import Sidebar from '../../Layouts/Sidebar'
import logo from "../../../Assets/image/sample.svg";
import Dropdown from 'react-bootstrap/Dropdown';
import { useParams } from 'react-router-dom';
import Moment from 'moment';

export default function ViewOffer() {

  const [offer,setOffer] = useState([]);
  const [perhour,setPerHour] = useState(0);
  const param            = useParams();
  const headers = {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    Authorization: `Bearer ` + localStorage.getItem("admin-token"),
  };
 
  const getOffer = () =>{
    axios
    .get(`/api/admin/offers/${param.id}`,{headers})
    .then((res)=>{
      let ar =[];
      ar.push(res.data.offer);
      setPerHour(res.data.offer.perhour);
      setOffer(ar);
    });
 }
 
  useEffect(()=>{
    getOffer();
  },[]);
 
  return (
    <div id="container">
      <Sidebar/>
      <div id='content'>
        <div className="AddOffer">
          <h1 className="page-title addEmployer">View Offer</h1>
          <div className='card'>
            <div className='card-body'>
              { offer && offer.map((ofr,i)=>{
                let cl = ofr.client;
                let services = (ofr.services) ? JSON.parse(ofr.services) : '';
                
             return(
              <div className='ViewOffer'>
                  <svg width="190" height="77" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">       
                    <image xlinkHref={logo} width="190" height="77"></image>
                  </svg>
                <div className='row'>
                  <div className='col-sm-5'>
                    <h2>Broom Service</h2>
                    <p>Bnei Dan St, Tel Aviv-Yafo</p>
                    <p>Israel</p>
                    <p>Phone: <span>+97235257060</span></p>
                    <p>Email: <span>office@broomservice.co.il</span></p>
                  </div>
                  <div className='col-sm-4'>
                    <h2>To</h2>
                    <p>{ cl.firstname+" "+cl.lastname }</p>
                    <p>{ cl.street_n_no }</p>
                    <p>{ cl.city+", "+cl.zipcode }</p>
                    <p>Phone: <span>{ cl.phone }</span></p>
                    <p>Email: <span>{ cl.email }</span></p>
                  </div>
                  <div className='col-sm-3 text-right'>
                    <h2>Offer Price</h2>
                    <p><b>Offer Id: </b><span> { ofr.id }</span></p>
                    <p><b>Date: </b><span> { Moment(ofr.created_at).format('MMMM DD,Y') }</span></p>
                    <div className='sent-status'>
                      <p>{ ofr.status }</p>
                    </div>
                  </div>
                </div>
                <div className="card card-dark">
                  <div className="card-header card-black">
                    <h3 class="card-title">Services</h3>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table class="table table-sm">
                        <thead>
                          <tr>
                            <th style={{width:"20%"}}>Service</th>
                            <th>Type</th>
                            <th className='text-right'>Frequency</th>
                            <th className='text-right'>Job Hours</th>
                            <th style={ ofr.type != 'fixed'? {display:"none"} : {}} className='text-right'>Price</th>
                            <th style={ perhour == 0 ? {display:"none"} : {}} className='text-right'>Rate Per Hour</th>
                            <th style={ ofr.type == 'fixed'? {display:"none"} : {}} className='text-right'>Total Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          { services && services.map((s,i)=>{
                            return(
                            <tr>
                              {(s.service == 10)
                                ? <td> { s.other_title }</td>
                                : <td>{s.name}</td>
                              }
                             
                              <td>{s.type}</td>
                              <td className='text-right'>{ s.freq_name }</td>
                              <td className='text-right'>{ s.jobHours } hour(s)</td>
                              {
                                (s.type != 'fixed' || perhour == 1 ) ?
                                <>
                                  <td className='text-right'>{ s.rateperhour ? s.rateperhour +" ILS" : '--' } </td>
                                  <td className='text-right'>{ s.totalamount} ILS</td>
                                </>
                              :
                                <>
                                  <td className='text-right'>{ s.fixed_price } ILS</td>
                                </>
                              }
                            </tr>
                            )
                          })}
                         
                        </tbody>
                      </table>
                    </div>
                    <div className='row'>
                      <div className='col-sm-6'></div>
                      <div className='col-sm-6'>
                        <div className="table-responsive">
                          <table class="table table-sm table-bordered ">
                            <tfoot>
                              <tr>
                                <td width="65%" class="text-right">Total</td>
                                <td class="text-right"><span>{ofr.subtotal} ILS + VAT </span></td> 
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              {/*  <Dropdown className='text-right'>
                  <Dropdown.Toggle className='btn-pink' id="dropdown-basic">Acton</Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href={`/admin/edit-offer/${ofr.id}`}>Edit</Dropdown.Item>
                    <Dropdown.Item href={`/admin/offered-price`}>Back</Dropdown.Item>
                  </Dropdown.Menu>
                        </Dropdown>*/}
              </div>  
           )
          })}
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}

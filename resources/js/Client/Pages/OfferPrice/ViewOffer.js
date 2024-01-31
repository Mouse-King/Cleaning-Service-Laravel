import React, { useEffect, useState } from 'react'
import ClientSidebar from '../../Layouts/ClientSidebar'
import logo from "../../../Assets/image/sample.svg";
import { useParams } from 'react-router-dom';
import Moment from 'moment';
import {Table, Thead, Tbody, Tr, Th, Td} from 'react-super-responsive-table'
import { useTranslation } from 'react-i18next';
import { Base64 } from "js-base64";

export default function ClientViewOffer() {

  const [offer,setOffer] = useState([]);
  const [perhour,setPerHour] = useState(0);
  const param            = useParams();
  const {t}             = useTranslation();
  const headers = {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    Authorization: `Bearer ` + localStorage.getItem("client-token"),
  };
 
  const getOffer = () =>{
    axios
    .post(`/api/client/view-offer`,{id:Base64.decode(param.id)},{headers})
    .then((res)=>{
      let ar =[];
      ar.push(res.data.offer);
      setOffer(ar);
      setPerHour(res.data.offer.perhour);
    });
 }
 
  useEffect(()=>{
    getOffer();
  },[]);
 
  return (
    <div id="container">
      <ClientSidebar/>
      <div id='content'>
        <div className="AddOffer">
          <h1 className="page-title addEmployer">{t('client.offer.view.title')}</h1>
          <div className='card'>
            <div className='card-body'>
              { offer && offer.map((ofr,i)=>{
                let cl = ofr.client;
                let services = (ofr.services) ? JSON.parse(ofr.services) : '';
                let found = false;
             return(
              <div className='ViewOffer'>
                  <svg width="190" height="77" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">       
                    <image xlinkHref={logo} width="190" height="77"></image>
                  </svg>
                <div className='row'>
                  <div className='col-sm-5'>
                    <h2>Broom Service</h2>
                    <p>4 Ashlinn House,College Squar</p>
                    <p>Florida, USA</p>
                    <p>{t('client.offer.view.phone')}: <span>0872992300</span></p>
                    <p>{t('client.offer.view.email')}: <span>info@yourcompany.com</span></p>
                  </div>
                  <div className='col-sm-4'>
                    <h2>{t('client.offer.view.to')}</h2>
                    <p>{ cl.firstname+" "+cl.lastname }</p>
                    <p>{ cl.street_n_no }</p>
                    <p>{ cl.city+", "+cl.zipcode }</p>
                    <p>{t('client.offer.view.phone')}: <span>{ cl.phone }</span></p>
                    <p>{t('client.offer.view.email')}: <span>{ cl.email }</span></p>
                  </div>
                  <div className='col-sm-3 text-right'>
                    <h2>{t('client.offer.view.ofr_price')}</h2>
                    <p><b>{t('client.offer.view.ofr_id')}: </b><span> { ofr.id }</span></p>
                    <p><b>{t('client.offer.view.date')}: </b><span> { Moment(ofr.created_at).format('MMMM DD,Y') }</span></p>
                    <div className='sent-status'>
                      <p>{ ofr.status }</p>
                    </div>
                  </div>
                </div>
                <div className="card card-dark">
                  <div className="card-header card-black">
                    <h3 class="card-title">{t('client.offer.view.services')}</h3>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                    <Table class="table table-sm responsiveTable">
                        <Thead>
                          <Tr>
                            <Th style={{width:"20%"}}>{t('client.offer.view.service')}</Th>
                            <Th style={{width:"20%"}}>{t('client.offer.view.type')}</Th>
                            <Th >{t('client.offer.view.frequency')}</Th>
                            <Th className='text-right'>{t('client.offer.view.job_hr')}</Th>
                            <Th style={ ofr.type != 'fixed'? {display:"none"} : {}} className='text-right'>{t('client.offer.view.job_price')}</Th>
                            <Th style={ perhour == 0 ? {display:"none"} : {}} className='text-right'>{t('client.offer.view.rate_ph')}</Th>
                            <Th style={ ofr.type == 'fixed'? {display:"none"} : {}} className='text-right'>{t('client.offer.view.total_amt')}</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          { services && services.map((s,i)=>{
                           
                            return(
                            <Tr>
                              <Td>{s.name}</Td>
                              <Td >{ s.type }</Td>
                              <Td >{ s.freq_name }</Td>
                              <Td className='text-right'>{ s.jobHours } {t('client.offer.view.hour_s')}</Td>
                              {
                                (s.type != 'fixed' || perhour == 1 ) ?
                                <>
                                  <Td className='text-right'>{ s.rateperhour ? s.rateperhour+" "+t('global.currency') : '--' }</Td>
                                  <Td className='text-right'>{ s.totalamount} {t('global.currency')}</Td>
                                </>
                              :
                                <>
                                  <Td className='text-right'>{ s.fixed_price } {t('global.currency')}</Td>
                                </>
                              }
                            </Tr>
                            )
                          })}
                         
                        </Tbody>
                      </Table>
                    </div>
                  </div>
                </div>
               
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

import React, { useEffect, useState } from 'react'
import ClientHistory from '../../Components/Clients/ClientHistory'
import ProfileDetails from '../../Components/Clients/ProfileDetails'
import Sidebar from '../../Layouts/Sidebar'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { Link } from "react-router-dom";

export default function ViewClient() {

  const [client, setClient] = useState([]);
  const [scheduleStatus, setSchedulesStatus] = useState([]);
  const [offerStatus, setOfferStatus] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [latestContract, setLatestContract] = useState([]);

  const param = useParams();
  const headers = {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    Authorization: `Bearer ` + localStorage.getItem("admin-token"),
  };

  const getLatestSchedule = () => {
    axios
      .post(`/api/admin/latest-client-schedule`, { id: param.id }, { headers })
      .then((res) => {
        (res.data.latestSchedule) ?
          setSchedulesStatus(res.data.latestSchedule.booking_status)
          : setSchedulesStatus('Not Sent');
      });
  }

  const getLatestOffer = () => {
    axios
      .post(`/api/admin/latest-client-offer`, { id: param.id }, { headers })
      .then((res) => {
        (res.data.latestOffer) ?
          setOfferStatus(res.data.latestOffer.status)
          : setOfferStatus('Not Sent');
      });
  }

  const getClient = () => {
    axios
      .get(`/api/admin/clients/${param.id}`, { headers })
      .then((res) => {
        setClient(res.data.client);
      });
  }

  const getContract = () => {
    axios
      .post(`/api/admin/client-contracts`, { id: param.id }, { headers })
      .then((res) => {
        setContracts(res.data.contracts.data);
        setLatestContract(res.data.latest);
      })
  }

  useEffect(() => {
    getClient();
    getLatestSchedule();
    getLatestOffer();
    getContract();
  }, [])

  return (
    <div id='container'>
      <Sidebar />
      <div id="content">
        <div className="titleBox customer-title">
          <div className="row">
            <div className="col-sm-6">
              <h1 className="page-title">View Client</h1>
            </div>
            <div className="col-sm-6">
              <div className="search-data">

                <Link to={`/admin/edit-client/${param.id}`} className="btn btn-pink addButton"><i className="btn-icon fas fa-pencil"></i>Edit</Link>
              </div>
            </div>
          </div>
        </div>
        <div className='view-applicant'>
          <ProfileDetails
            client={client}
            offerStatus={offerStatus}
            scheduleStatus={scheduleStatus}
            latestContract={latestContract}
          />
          <div className='card mt-3'>
            <div className='card-body'>
              <ClientHistory
              contracts={contracts} setContracts={setContracts}
              latestContract={latestContract}
              client={client}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

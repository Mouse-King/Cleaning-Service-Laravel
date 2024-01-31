import React, { useEffect, useState } from 'react'
import Sidebar from '../../Layouts/Sidebar'
import LeadDetails from '../../Components/Leads/LeadDetails'
import ClientHistoryLead from '../../Components/Leads/ClientHistoryLead'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { Link } from "react-router-dom";

export default function ViewLead() {

  const [lead, setLead] = useState([]);

  const param = useParams();
  const headers = {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    Authorization: `Bearer ` + localStorage.getItem("admin-token"),
  };

  const getLead = () => {
    axios
      .get(`/api/admin/leads/${param.id}/edit`, { headers })
      .then((res) => {
        setLead(res.data.lead);
      });
  }
  useEffect(() => {
    getLead();
  }, [])

  return (
    <div id='container'>
      <Sidebar />
      <div id="content">
        <div className="titleBox customer-title">
          <div className="row">
            <div className="col-sm-6">
              <h1 className="page-title">View Lead</h1>
            </div>
            <div className="col-sm-6">
              <div className="search-data">
             
                <Link to={`/admin/add-lead-client/${param.id}`} className="btn btn-pink addButton"><i className="btn-icon fas fa-pencil"></i>Edit</Link>
              </div>
            </div>
          </div>
        </div>
        <div className='view-applicant'>
          <LeadDetails
            lead={lead}
          />
          <div className='card mt-3'>
            <div className='card-body'>
              <ClientHistoryLead
                client={lead}
              />
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}


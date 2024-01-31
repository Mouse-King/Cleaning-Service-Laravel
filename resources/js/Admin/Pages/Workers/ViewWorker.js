import React from 'react'
import WorkerHistory from '../../Components/Workers/WorkerHistory'
import WorkerProfile from '../../Components/Workers/WorkerProfile'
import Sidebar from '../../Layouts/Sidebar'
import { Link, useParams } from "react-router-dom";

export default function ViewWorker() {
    const param = useParams();
    return (
        <div id='container'>
            <Sidebar />
            <div id="content">
                <div className="titleBox customer-title">
                    <div className="row">
                        <div className="col-sm-6">
                            <h1 className="page-title">View Worker</h1>
                        </div>
                        <div className="col-sm-6">
                            <div className="search-data">

                                <Link to={`/admin/edit-worker/${param.id}`} className="btn btn-pink addButton"><i className="btn-icon fas fa-pencil"></i>Edit</Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='view-applicant'>
                    <WorkerProfile />
                    <WorkerHistory />
                </div>
            </div>
        </div>
    )
}

import React from 'react'
import WorkerNotAvailability from '../../Components/Availability/WorkerNotAvailability'
import WorkerSidebar from '../../Layouts/WorkerSidebar'
import { useTranslation } from 'react-i18next'

export default function NotAvailability() {
  const {t} = useTranslation();
  return (
    <div id='container'>
        <WorkerSidebar/>
        <div id="content">
            <div className='view-applicant'>
                <div class="titleBox customer-title">
                    <div class="row">
                        <div class="col-sm-6">
                            <h1 className="page-title">{t('worker.schedule.title')}</h1>
                        </div>
                        <div class="col-sm-6">
                            <button type="button" className="btn btn-pink addButton" data-toggle="modal" data-target="#exampleModalNote">
                                Add Date
                            </button>
                        </div>
                    </div>
                </div>
                <WorkerNotAvailability/>     
            </div>
        </div>
    </div>
  )
}


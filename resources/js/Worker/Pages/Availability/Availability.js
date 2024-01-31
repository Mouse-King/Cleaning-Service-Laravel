import React from 'react'
import WorkerAvailabilty from '../../Components/Availability/WorkerAvailabilty'
import WorkerSidebar from '../../Layouts/WorkerSidebar'
import { useTranslation } from 'react-i18next'

export default function Availability() {
  const {t} = useTranslation();
  return (
    <div id='container'>
        <WorkerSidebar/>
        <div id="content">
            <div className='view-applicant'>
                <h1 className="page-title viewAppli">{t('worker.schedule.title')}</h1>
                <WorkerAvailabilty/>     
            </div>
        </div>
    </div>
  )
}

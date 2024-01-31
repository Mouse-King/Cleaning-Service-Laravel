import React from 'react'
import WorkerMyAccount from '../../Auth/WorkerMyAccount'
import Documents from '../../Auth/Documents'
import WorkerContract from '../../Auth/WorkerContract'
import WorkerSidebar from '../../Layouts/WorkerSidebar'
import { useTranslation } from 'react-i18next'

export default function MyAccount() {
  const {t} = useTranslation();
  return (
    <div id='container'>
        <WorkerSidebar/>
        <div id="content">
            <div className='view-applicant mt-3'>  
              <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item" role="presentation"><a id="worker-availability" className="nav-link active" data-toggle="tab" href="#tab-worker-availability" aria-selected="true" role="tab"><h4>{t('worker.settings.edit_account')}</h4></a></li>
                <li className="nav-item" role="presentation"><a id="current-job" className="nav-link" data-toggle="tab" href="#tab-current-job" aria-selected="true" role="tab"><h4>{t('worker.settings.manage_form')}</h4></a></li>
                <li className="nav-item" role="presentation"><a id="contract" className="nav-link" data-toggle="tab" href="#tab-contract" aria-selected="true" role="tab"><h4>{t('worker.settings.view_contract')}</h4></a></li>
              </ul>
              <div className='tab-content' style={{background: "#fff"}}>
                <div id="tab-worker-availability" className="tab-pane active show" role="tab-panel" aria-labelledby="current-job"><WorkerMyAccount/></div>
                <div id="tab-current-job" className="tab-pane" role="tab-panel" aria-labelledby="current-job"><Documents/></div>
                <div id="tab-contract" className="tab-pane" role="tab-panel" aria-labelledby="current-job"><WorkerContract/></div>
              </div>
            </div>
        </div>
    </div>
  )
}

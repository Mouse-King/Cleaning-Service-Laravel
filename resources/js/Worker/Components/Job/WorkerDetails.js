import React  from 'react'
import { useTranslation } from 'react-i18next'

export default function WorkerDetails({worker}) {
    const {t} = useTranslation();
  return (
    <>
                    <h2 className="text-danger">{t('worker.jobs.view.w_details')}</h2>
                    <div className='dashBox p-4 mb-3'>
                        <form>
                            <div className='row'>
                                <div className='col-sm-4'>
                                    <div className='form-group'>
                                        <label className='control-label'>{t('worker.jobs.view.w_name')}</label>
                                         <p>{worker.firstname} {worker.lastname}</p>
                                    </div>
                                </div>
                                <div className='col-sm-4'>
                                    <div className='form-group'>
                                        <label className='control-label'>{t('worker.jobs.view.w_email')}</label>
                                          <p>{worker.email}</p>
                                    </div>
                                </div>
                                <div className='col-sm-4'>
                                    <div className='form-group'>
                                        <label className='control-label'>{t('worker.jobs.view.w_phone')}</label>
                                       <p>{worker.phone}</p>
                                    </div>
                                </div>
                                <div className='col-sm-8'>
                                    <div className='form-group'>
                                        <label className='control-label'>{t('worker.jobs.view.address')}</label>
                                        <p>{worker.address}</p>
                                    </div>
                                </div>
                               
                        </div>
                </form>
            </div>
        </>
 )
}

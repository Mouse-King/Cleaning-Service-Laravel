import React from 'react'
import { useTranslation } from 'react-i18next'

export default function Services({ services, job }) {
    const { t, i18n } = useTranslation();
    const w_lng = i18n.language;

    return (
        <>
            <h2 className="text-custom">{t('worker.jobs.view.s_details')}</h2>
            <div className='dashBox p-4 mb-3'>
                {
                    services && services.map((s, i) => {
                        return (
                            <form>
                                <div className='row'>
                                    <div className='col-sm-3'>
                                        <div className='form-group'>
                                            <label className='control-label'>{t('worker.jobs.view.services')}</label>
                                            <p>{
                                                (w_lng == 'en')
                                                    ? (s.name)
                                                    :
                                                    (s.heb_name)
                                            }</p>
                                        </div>
                                    </div>
                                    <div className='col-sm-3'>
                                        <div className='form-group'>
                                            <label className='control-label'>{t('worker.jobs.view.job_date')}</label>

                                            <p>{job.start_date}</p>
                                        </div>
                                    </div>
                                    <div className='col-sm-3'>
                                        <div className='form-group'>
                                            <label className='control-label'>{t('worker.jobs.view.c_time')}</label>
                                            <p>{s.job_hour} hours</p>
                                        </div>
                                    </div>
                                    <div className='col-sm-3'>
                                        <div className='form-group'>
                                            <label className='control-label'>{t('worker.jobs.view.shift')}</label>
                                            <p>{job.shifts}</p>
                                        </div>
                                    </div>

                                </div>
                            </form>
                        )
                    })
                }

            </div>
        </>
    )
}

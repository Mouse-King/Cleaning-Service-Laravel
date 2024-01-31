import React, { useTransition }  from 'react'
import { useTranslation } from 'react-i18next';

export default function ClientDetails({client}) {  
    const {t} = useTranslation();
    let geo_address = (client.geo_address) ? client.geo_address : "NA";
    let cords   = (client.latitude && client.longitude) ? client.latitude +","+ client.longitude :"";
  return (
    <>               
                    <div className='dashBox p-4 mb-3'>
                        <form>
                            <div className='row'>
                                <div className='col-sm-4'>
                                    <div className='form-group'>
                                        <label className='control-label'>{t('worker.jobs.view.c_name')}</label>
                                          <p>{client.firstname} {client.lastname}</p>
                                    </div>
                                </div>
                                <div className='col-sm-4'>
                                    <div className='form-group'>
                                        <label className='control-label'>{t('worker.jobs.view.c_email')}</label>
                                          <p>{client.email}</p>
                                    </div>
                                </div>
                                <div className='col-sm-4'>
                                    <div className='form-group'>
                                        <label className='control-label'>{t('worker.jobs.view.c_phone')}</label>
                                         <p>{client.phone}</p>
                                    </div>
                                </div>
                                <div className='col-sm-6'>
                                            <div className='form-group'>
                                                <label>{t('worker.jobs.view.geo_adr')}</label>
                                                <p><a href={`https://maps.google.com?q=${ cords}`} target='_blank'>
                                                    {geo_address}</a></p>
                                            </div>
                                        </div>
                                        
                               
                        </div>
                </form>
            </div>
        </>
 )
}

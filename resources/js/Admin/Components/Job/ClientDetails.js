import React  from 'react'
import { Link } from 'react-router-dom'
export default function ClientDetails({client}) {
    var cords = (client.latitude && client.longitude)
    ? client.latitude + "," + client.longitude : 'NA';

  return (
    <>
                    <h2 className="text-custom">Client Details</h2>
                    <div className='dashBox p-4 mb-3'>
                        <form>
                            <div className='row'>
                                <div className='col-sm-6'>
                                    <div className='form-group'>
                                        <label className='control-label'>Client Name</label>
                                          <p> <Link to={client ? `/admin/view-client/${client.id}` : '#'}>
                                            {client.firstname} {client.lastname}</Link></p>
                                    </div>
                                </div>
                                <div className='col-sm-6'>
                                    <div className='form-group'>
                                        <label className='control-label'>Client Email</label>
                                          <p>{client.email}</p>
                                    </div>
                                </div>
                                <div className='col-sm-6'>
                                    <div className='form-group'>
                                        <label className='control-label'>Client Phone</label>
                                         <p><a href={`tel:${client.phone}`}>{client.phone}</a></p>
                                    </div>
                                </div>
                                <div className='col-sm-4'>
                                    <div className='form-group'>
                                        <label className='control-label'>City</label>
                                         <p>{client.city}</p>
                                       
                                    </div>  </div>
                                <div className='col-sm-8'>
                                    <div className='form-group'>
                                        <label className='control-label'>Address</label>
                                         <p><Link target="_blank" to={`https://maps.google.com?q=${cords}`}>{client.geo_address}</Link></p>
                                    </div>
                                </div>
                               
                        </div>
                </form>
            </div>
        </>
 )
}

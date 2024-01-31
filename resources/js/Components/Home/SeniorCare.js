import React from 'react'
import senior from '../../Assets/image/Frontend/senior.jpg'

export default function SeniorCare() {
  return (
    <div className='senior-care'>
        <div className='container'>
            <div className='row'>
                <div className='col-sm-6'>
                    <h3>Excellent Senior Care for Extraordinary Families</h3>
                    <div className='info-list'>
                        <div className='icons'>
                            <i className='fa fa-check'></i>
                        </div>
                        <div className='info-text'>
                            <p>Give yourself the power of responsibility. Remind yourself the only thing stopping you is yourself.</p>
                        </div>
                    </div>
                    <div className='info-list'>
                        <div className='icons'>
                            <i className='fa fa-check'></i>
                        </div>
                        <div className='info-text'>
                            <p>Make a list of your achievements toward your long-term goal and remind yourself that intentions.</p>
                        </div>
                    </div>
                    <div className='info-list'>
                        <div className='icons'>
                            <i className='fa fa-check'></i>
                        </div>
                        <div className='info-text'>
                            <p>Let success motivate you. Find a picture of what epitomizes success to you and then pull it out.</p>
                        </div>
                    </div>
                    <div className='info-list'>
                        <div className='icons'>
                            <i className='fa fa-check'></i>
                        </div>
                        <div className='info-text'>
                            <p>Reflect and experiment until you find the right combination of motivators for your personality.</p>
                        </div>
                    </div>
                </div>
                <div className='col-sm-6'>
                    <img src={senior} className='img-fluid' alt='Senior' />
                </div>
            </div>
        </div>
    </div>
  )
}

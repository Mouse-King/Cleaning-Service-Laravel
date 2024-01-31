import React, { useState } from 'react'

export default function Help() {
    const [questionemail, setQuestionEmail] = useState('info@yeliko.com');
    const [helpline, setHelpline] = useState('+44 3764213 234, +44 234785213');
    const [concernemail, setConcernEmail] = useState('test@yeliko.com');
  return (
    <div className='start help'>
        <div className='container'>
            <div className='row'>
                <div className='col-sm-4'>
                    <div className='sBox'>
                        <i className="fa-solid fa-right-to-bracket"></i>
                        <h5>General Questions</h5>
                        <p>{questionemail}</p>
                    </div>
                </div>
                <div className='col-sm-4'>
                    <div className='sBox'>
                        <i className="fa-solid fa-phone"></i>
                        <h5>Helpline</h5>
                        <p>{helpline}</p>
                    </div>
                </div>
                <div className='col-sm-4'>
                    <div className='sBox'>
                        <i className="fa-solid fa-business-time"></i>
                        <h5>Business Concerns</h5>
                        <p>{concernemail}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

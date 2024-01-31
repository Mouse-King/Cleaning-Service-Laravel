import React, { useState } from 'react'

export default function WorkScenario() {
  const [ rate ] = useState('€15');
  const [workSlot, setWorkSlot] = useState([
    {day: "Monday", time: "8 AM - 10 AM"},
    {day: "Tuesday", time: "3 PM - 4 PM"},
    {day: "Wednesday", time: "6 PM - 7 PM"}
    
])
  return (
    <form className='dashBox mt-3 p-3'>
        <div className='form-group'>
            <label className='control-label'>Hourly Rate</label>
            <input disabled type='text' className='form-control' value={rate} />
        </div>
        <div className='form-group'>
            <label className='control-label'>Availablity</label>
            <div className='items-time dashBox'>
                <div className='row'>
                    {workSlot && workSlot.map((item, index) => (
                        <div className='col-sm-2' key={index}>
                            <div className='defineTime'>
                                <h4>{item.day}</h4>
                                <ul className='list-inline'>
                                    <li>
                                        <a disabled href='#!' className='btn btn-danger'>{item.time}</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </form>
  )
}

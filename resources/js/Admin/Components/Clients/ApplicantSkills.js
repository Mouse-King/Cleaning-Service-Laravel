import React, { useState } from 'react'

export default function ApplicantSkills() {
  const [task, setTask] = useState([
    {taskItem: "Accomapaniment during various activities"},
    {taskItem: "Assistance with meals"},
    {taskItem: "Day and night care"},
    {taskItem: "Shopping Pharmacy"},
    {taskItem: "Meal Preparation"}
  ])
  const [ language ] = useState('Albanian');
  const [ experience ] = useState('3-5 years');
  const [ license ] = useState('Yes');
  const [ motorized ] = useState('No');
  const [ diploma ] = useState('Yes');
  const [ intro ] = useState('These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided.');
  return (
    <form className='dashBox mt-3 p-3 appSkills'>
        <div className='form-group'>
            <label className='control-label'>Expertise in:</label>
            <ul className='list-inline mb-4'>
                {task && task.map((item, index) => (
                    <li key={index} className='list-inline-item'>{item.taskItem}</li>
                ))}
            </ul>
        </div>
        <div className='row'>
            <div className='col-sm-4'>
                <div className='form-group'>
                    <label className='control-label'>Years of Experience:</label>
                    <input disabled type='text' className='form-control' value={experience} />
                </div>
            </div>
            <div className='col-sm-8'>
                <div className='form-group'>
                    <label className='control-label'>Other language spoken:</label>
                    <input disabled type='text' className='form-control' value={language} />
                </div>
            </div>
            <div className='col-sm-4'>
                <div className='form-group'>
                    <label className='control-label'>Driving license:</label>
                    <input disabled type='text' className='form-control' value={license} />
                </div>
            </div>
            <div className='col-sm-4'>
                <div className='form-group'>
                    <label className='control-label'>Motorized:</label>
                    <input disabled type='text' className='form-control' value={motorized} />
                </div>
            </div>
            <div className='col-sm-4'>
                <div className='form-group'>
                    <label className='control-label'>First Aid Diploma (PSCI):</label>
                    <input disabled type='text' className='form-control' value={diploma} />
                </div>
            </div>
            <div className='col-sm-12'>
                <div className='form-group'>
                    <label className='control-label'>Brief Intro:</label>
                    <textarea disabled value={intro} className='form-control'></textarea>
                </div>
            </div>
        </div>
    </form>
  )
}

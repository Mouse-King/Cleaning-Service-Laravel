import React from 'react'
import Sidebar from '../../../Layouts/Sidebar'

export default function AddTime() {
  return (
    <div id="container">
        <Sidebar/>
        <div id="content">
            <div className="add-time">
                <h1 className="page-title addEmployer">Add Time</h1>
                <form>
                    <div className='form-group' style={{maxWidth: "400px"}}>
                        <label className='control-label'>Start Time</label>
                        <input type='time' className='form-control'/>
                    </div>
                    <div className='form-group' style={{maxWidth: "400px"}}>
                        <label className='control-label'>End Time</label>
                        <input type='time' className='form-control'/>
                    </div>
                    <div className="form-group" style={{maxWidth: "400px"}}>
                        <label className="control-label">Status</label>
                        <select className="form-control" onChange={(e) => setStatus(e.target.value)}>
                            <option>Please select</option>
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>
                    </div>
                    <div className="form-group" style={{maxWidth: "400px"}}>
                        <button className='btn btn-pink'>SAVE</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

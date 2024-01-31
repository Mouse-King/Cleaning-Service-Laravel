import React, { useState } from "react";
import Sidebar from '../../Layouts/Sidebar'

export default function EditContract() {
  const [client, setClient] = useState("");
  const [service, setService] = useState("");
  const [instructions, setInstructions] = useState("");
  const [starttime, setStartTime] = useState("");
  const [endtime, setEndTime] = useState("");
  const [rateperhour, setRatePerHour] = useState("");
  const [totalamount, setTotalAmout] = useState("");

  return (
    <div id="container">
      <Sidebar/>
      <div id='content'>
        <div className="AddOffer">
          <h1 className="page-title addEmployer">Edit Contract</h1>
          <div className='card'>
            <div className='card-body'>
              <form>
                <div className='row'>
                  <div className='col-sm-12'>
                    <div className="form-group">
                      <label className="control-label">Client</label>
                      <select
                          className="form-control"
                          value={client}
                          onChange={(e) => setClient(e.target.value)}>
                          <option>Please select</option>
                          <option value="1">Clemmie Wolf</option>
                          <option value="2">Savanah Blick</option>
                          <option value="3">Darryl Turcotte</option>
                          <option value="4">Vivien Funk</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="control-label">Service For</label>
                      <select
                          className="form-control"
                          value={service}
                          onChange={(e) => setService(e.target.value)}
                      >
                          <option>Please select</option>
                          <option value="1">Planting</option>
                          <option value="2">Garden grass cutting</option>
                          <option value="3">Glass furnishing</option>
                          <option value="4">Door Mattings</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="control-label">Instructions</label>
                      <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} className="form-control" required placeholder="Instructions"/>
                    </div>
                    <div className="card card-dark">
                      <div className="card-header card-black">
                        <h3 class="card-title">Line Items</h3>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive">
                          <table class="table table-sm">
                            <thead>
                              <tr>
                                <th style={{width:"50%"}}>Services</th>
                                <th style={{width:"6%"}}>Start Time</th>
                                <th style={{width:"6%"}}>End Time</th>
                                <th style={{width:"16%"}}>Rate Per Hour</th>
                                <th style={{width:"16%"}}>Total Amount</th>
                                <th style={{width:"6%"}}></th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>
                                  <select className="form-control"  value={service} onChange={(e) => setService(e.target.value)}>
                                    <option>Please select</option>
                                    <option value="1">Planting</option>
                                    <option value="2">Garden grass cutting</option>
                                    <option value="3">Glass furnishing</option>
                                    <option value="4">Door Mattings</option>
                                  </select>
                                </td>
                                <td>
                                  <input type="time" value={starttime} onChange={(e) => setStartTime(e.target.value)} className="form-control" required />
                                </td>
                                <td>
                                  <input type="time" value={endtime} onChange={(e) => setEndTime(e.target.value)} className="form-control" required />
                                </td>
                                <td>
                                  <input type="text" value={rateperhour} onChange={(e) => setRatePerHour(e.target.value)} className="form-control" required placeholder="Enter rate per hour"/>
                                </td>
                                <td>
                                  <input type="text" value={totalamount} onChange={(e) => setTotalAmout(e.target.value)} className="form-control" required placeholder="Enter total amount"/>
                                </td>
                                <td class="text-right"><button className="ml-2 btn bg-red" onClick={() => handleDelete(item.id)}><i className="fa fa-minus"></i></button></td>
                              </tr>
                            </tbody>
                            <tfoot>
                              <tr>
                                <td class="text-right" colspan="6">
                                    <button type="button" class="btn bg-green" onclick="addLineItem();"><i class="fa fa-plus"></i></button>
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                    <input type="submit" value="Save and Send" className="btn btn-pink saveBtn"/>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

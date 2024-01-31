import React, { useState, useEffect } from 'react'
import Sidebar from '../../Layouts/Sidebar'
import { SelectPicker } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';
import axios from 'axios';
import { useAlert } from 'react-alert';
import { useNavigate } from 'react-router-dom';

export default function AddOffer() {

  const alert = useAlert();
  const navigate = useNavigate();
  const [type, setType] = useState();
  const queryParams = new URLSearchParams(window.location.search);
  const cid = parseInt(queryParams.get("c"));
  const [client, setClient] = useState((cid != null) ? cid : "");
  const [formValues, setFormValues] = useState([{
    service: "",
    name: "",
    type: "",
    freq_name: "",
    frequency: "",
    fixed_price: "",
    jobHours: "",
    rateperhour: '',
    other_title:'',
    totalamount: '',
    template:'',
    cycle:'',
    period:''
  }])
  const [AllClients, setAllClients] = useState([]);
  const [AllServices, setAllServices] = useState([]);
  const [AllFreq, setAllFreq] = useState([]);

  let handleChange = (i, e) => {

    let newFormValues = [...formValues];

    var h = e.target.parentNode.parentNode.childNodes[1].childNodes[0].value;
    var rh = e.target.parentNode.parentNode.childNodes[2].childNodes[0].value;
    if (rh != '' && h != '')
      e.target.parentNode.parentNode.childNodes[3].childNodes[0].setAttribute('value', h * rh);

    newFormValues[i][e.target.name] = e.target.value;
    if (e.target.name == 'service') {
      newFormValues[i]['name'] = e.target.options[e.target.selectedIndex].getAttribute('name');
      newFormValues[i]['template'] = e.target.options[e.target.selectedIndex].getAttribute('template');
    }
    if (e.target.name == 'frequency') {
      newFormValues[i]['freq_name'] = e.target.options[e.target.selectedIndex].getAttribute('name');
      newFormValues[i]['cycle'] = e.target.options[e.target.selectedIndex].getAttribute('cycle');
      newFormValues[i]['period'] = e.target.options[e.target.selectedIndex].getAttribute('period');
    }
    setFormValues(newFormValues);
  }
  let addFormFields = () => {
    setFormValues([...formValues, { 
      service: "",
      name: "",
      type: "",
      freq_name: "",
      frequency: "",
      fixed_price: "",
      jobHours: "",
      rateperhour: '',
      other_title:'',
      totalamount: '',
      template:'',
      cycle:'',
      period:''
    }])
  }

  let removeFormFields = (i) => {
    let newFormValues = [...formValues];
    newFormValues.splice(i, 1);
    setFormValues(newFormValues)
  }

  const headers = {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    Authorization: `Bearer ` + localStorage.getItem("admin-token"),
  };

  const getClients = () => {
    axios
      .get('/api/admin/all-clients', { headers })
      .then((res) => {
        setAllClients(res.data.clients);
      })

  }
  const getServices = (lng) => {
    axios
      .post('/api/admin/all-services',{lng}, { headers })
      .then((res) => {
        setAllServices(res.data.services);
      })
  }
  const getFrequency = (lng) => {
    axios
      .post('/api/admin/all-service-schedule',{lng}, { headers })
      .then((res) => {
        setAllFreq(res.data.schedules);
      })
  }

  const handleServiceLng = (client) =>{
    axios
    .get(`/api/admin/clients/${client}`,{headers})
    .then((res)=>{
      const lng = res.data.client.lng;
      getServices(lng);
      getFrequency(lng)
    })
  }

  useEffect(() => {
    getClients();
    if(cid){
    handleServiceLng(cid);
  }
  }, []);

  const cData = AllClients.map((c, i) => {
    return { value: c.id, label: (c.firstname + ' ' + c.lastname) };
  });

  const handleJob = (e) => {
    e.preventDefault();
    setFormValues([{
      service: "",
      name: "",
      type: "",
      freq_name: "",
      frequency: "",
      fixed_price: "",
      jobHours: "",
      rateperhour: '',
      other_title:'',
      totalamount: ''
    }]);
    let v = e.target.value;
    let th = document.querySelectorAll('.table th');
    if (v == 'hourly') {

      th[3].style.display = "none";
      th[4].style.display = "table-cell";

    } else {

      th[3].style.display = "table-cell";
      th[4].style.display = "none";
    }
  }
  const handleType = (e) => {

    let fixed_field = e.target.parentNode.nextSibling.nextElementSibling.nextElementSibling;
    let per_hour_field = e.target.parentNode.nextSibling.nextElementSibling.nextElementSibling.nextElementSibling;

    if (e.target.value == 'hourly') {
      fixed_field.style.display = 'none';
      per_hour_field.style.display = 'block';
    } else {
      fixed_field.style.display = 'block';
      per_hour_field.style.display = 'none';

    }
  }



  let handleSubmit = (event) => {
    event.preventDefault();

    let to = 0;
    let taxper = 17;

    for (let t in formValues) {

      if (formValues[t].service == '' || formValues[t].service == 0) {
        alert.error("One of the service is not selected");
        return false;
      }

      let ot = document.querySelector('#other_title'+t);
      
       if (formValues[t].service == '10' && ot != undefined) {
        if (formValues[t].other_title == '') { alert.error('Other title cannot be blank'); return false; }
        formValues[t].other_title = document.querySelector('#other_title'+t).value;
      }

      if (formValues[t].frequency == '' || formValues[t].frequency == 0) {
        alert.error("One of the frequency is not selected");
        return false;
      }
      if (formValues[t].jobHours == '') {
        alert.error("One of the job hours value is missing");
        return false;
      }
      (!formValues[t].type) ? formValues[t].type = 'fixed' : '';
      if (formValues[t].type == "hourly") {

        if (formValues[t].rateperhour == '') {
          alert.error("One of the rate per hour value is missing");
          return false;
        }
        formValues[t].totalamount = parseInt(formValues[t].jobHours * formValues[t].rateperhour);
        to += parseInt(formValues[t].totalamount);


      } else {

        if (formValues[t].fixed_price == '') {
          alert.error("One of the job price is missing");
          return false;
        }
        formValues[t].totalamount = parseInt(formValues[t].fixed_price);
        to += parseInt(formValues[t].fixed_price);
      }



    }


    let tax = (taxper / 100) * to;
    const data = {
      client_id: client,
      status: 'sent',
      subtotal: to,
      total: to + tax,
      services: JSON.stringify(formValues),
      action: event.target.value,
    }

    event.target.setAttribute('disabled', true);
    event.target.value = (event.target.value == 'Save') ? ('Saving..') : ('Sending..');
    axios
      .post(`/api/admin/offers`, data, { headers })
      .then((response) => {
        if (response.data.errors) {
          for (let e in response.data.errors) {
            alert.error(response.data.errors[e]);
          }
          document.querySelector('.saveBtn').removeAttribute('disabled');
          document.querySelector('.saveBtn').value = (event.target.value == 'Save') ? ('Save') : ('Save and Send');
        } else {
          alert.success(response.data.message);
          setTimeout(() => {
            navigate(`/admin/offered-price`);
          }, 1000);
        }
      });


  }
  const handleOther = (e) => {
   
    let el = e.target.parentNode.lastChild;
    if (e.target.value == 10) {
     
      el.style.display = 'block'
      el.style.marginBlock = "8px";
      el.style.width="150%";
      
    } else {
     
      el.style.display = 'none'
    }
  }

  return (
    <div id="container">
      <Sidebar />
      <div id='content'>
        <div className="AddOffer">
          <h1 className="page-title addEmployer">Add Offer</h1>
          <div className='card'>
            <div className='card-body'>
              <form>
                <div className='row'>
                  <div className='col-sm-12'>

                    <div className="form-group">
                      <label className="control-label">Client Name</label>
                      <SelectPicker data={cData} value={client} onChange={(value, event) => {setClient(value);handleServiceLng(value);}} size="lg" required />
                    </div>

                    <div className="card card-dark">
                      <div className="card-header card-black">
                        <h3 class="card-title">Services</h3>
                      </div>
                      <div className="card-body">
                        <div className="table-responsive">
                          <table class="table table-sm">
                            <thead>
                              <tr>
                                <th style={{ width: "20%" }}>Service</th>
                                <th style={{ width: "20%" }}>Type</th>
                                <th style={{ width: "20%" }}>Frequency</th>
                                <th style={{ width: "20%" }}>Job Hours</th>
                                <th style={{ width: "20%" }}>Price</th>
                                <th style={{ width: "20%", display: "none" }}>Rate Per Hour</th>
                              </tr>
                            </thead>
                            <tbody>
                              {formValues.map((element, index) => (
                                <tr key={index}>

                                  <td>
                                    <select name="service" className="form-control" value={element.service || ""} onChange={e => { handleChange(index, e); handleOther(e); }} >
                                      <option selected value={0}> -- Please select --</option>
                                      {AllServices && AllServices.map((s, i) => {
                                        return (
                                          <option  name={s.name} template={s.template} value={s.id}> {s.name} </option>
                                        )
                                      })}
                                    </select>
                      
                                    <textarea type="text" name="other_title" id={`other_title`+index} placeholder='Service Title' style={(element.other_title == '') ? { "display": "none" } : {}} className="form-control" value={element.other_title || ""} onChange={e => handleChange(index, e)} />
                                  </td>
                                  <td>
                                    <select name="type" className="form-control" value={element.type || ""} onChange={(e) => { handleChange(index, e); handleType(e) }} >
                                      <option selected value="fixed">Fixed</option>
                                      <option selected value="hourly">Hourly</option>
                                    </select>
                                  </td>

                                  <td>
                                    <select name="frequency" className="form-control" value={element.frequency || ""} onChange={e => handleChange(index, e)} >
                                      <option selected value={0}> -- Please select --</option>
                                      {AllFreq && AllFreq.map((s, i) => {
                                        return (
                                          <option cycle={s.cycle} period={s.period} name={s.name} value={s.id}> {s.name} </option>
                                        )
                                      })}
                                    </select>
                                  </td>

                                  <td>
                                    <input type="number" name="jobHours" value={element.jobHours || ""} onChange={e => handleChange(index, e)} className="form-control jobhr" required placeholder="Enter job Hrs" />
                                  </td>
                                  <td style={(type == 'hourly') ? { "display": "none" } : {}}>
                                    <input type="number" name="fixed_price" value={element.fixed_price || ""} onChange={e => handleChange(index, e)} className="form-control jobprice" required placeholder="Enter job price" />
                                  </td>
                                  <td style={(type != 'hourly') ? { "display": "none" } : {}}>
                                    <input type="text" name="rateperhour" value={element.rateperhour || ""} onChange={e => handleChange(index, e)} className="form-control jobrate" required placeholder="Enter rate P/Hr" />
                                  </td>
                                  {/*<td>
                                  <input type="text" name="totalamount" readonly disabled className="form-control" required  placeholder="Total"/>
                                  </td>*/}
                                  <td class="text-right"><button className="ml-2 btn bg-red" onClick={() => removeFormFields(index)}><i className="fa fa-minus"></i></button></td>
                                </tr>
                              ))}

                            </tbody>

                            <tfoot>
                              <tr>
                                <td class="text-right" colSpan="6">
                                  <button type="button" class="btn bg-green" onClick={() => addFormFields()}><i class="fa fa-plus"></i></button>
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
                  <input type="submit" value="Save" className="btn btn-success saveBtn" onClick={handleSubmit} style={{ 'margin-inline': '6px' }} />
                  <input type="submit" value="Save and Send" className="btn btn-pink saveBtn" onClick={handleSubmit} />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

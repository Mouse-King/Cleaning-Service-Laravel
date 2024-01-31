import React, { useState, useEffect } from 'react'
import moment from 'moment-timezone';
import { useNavigate, useParams } from 'react-router-dom';
import { useAlert } from 'react-alert';
import Select from 'react-select';
import {Table, Thead, Tbody, Tr, Th, Td} from 'react-super-responsive-table'


export default function CreateClientByJob() {
    const params = useParams();
    const navigate = useNavigate();
    const alert = useAlert();
    const [AllWorkers, setAllWorkers] = useState([]);
    const [AllJobs, setAllJobs] = useState([]);
    const [AllWorkerAvailability, setAllWorkerAvailability] = useState([]);
    const [startSlot, setStartSlot] = useState([]);
    const [endSlot, setEndSlot] = useState([]);
    const [interval, setTimeInterval] = useState([]);
    const [selected_service, setSelectedService] = useState('');
    const [data, setData] = useState([]);
    const [c_time, setCTime] = useState(0);

    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };

    const [services, setServices] = useState([]);
    const [clientname, setClientName] = useState('');
    const getJob = () => {
        axios
            .get(`/api/admin/get-contract-by-client/${params.id}`, { headers })
            .then((res) => {
                const r = res.data.contract;
                setClientName(res.data.client.firstname + ' ' + res.data.client.lastname);
                let new_data=[];
                let all_s=[];
                r.map((c)=>{
                    
                   new_data=JSON.parse(c.offer.services);
                   new_data = new_data.filter((n)=>{
                         n["c_id"] =c.id
                         return n
                   });
                    Array.prototype.push.apply(all_s,new_data)
                })
                setServices(all_s);
            });
    }
    useEffect(() => {
        getJob();
    }, []);
    const getJobs = () => {
        axios
            .get('/api/admin/get-all-jobs', { headers })
            .then((res) => {
                setAllJobs(res.data.jobs);
            })
    }
    const getWorkerAvailabilty = () => {
        axios
            .get('/api/admin/all-workers/availability', { headers })
            .then((res) => {
                setAllWorkerAvailability(res.data.availability);
            })
    }
    const getTime = () => {
        axios
            .get(`/api/admin/get-time`, { headers })
            .then((res) => {
                if (res.data.time.length > 0) {
                    setStartSlot(res.data.time[0].start_time);
                    setEndSlot(res.data.time[0].end_time);
                    let ar = JSON.parse(res.data.time[0].days);
                    let ai = [];
                    ar && ar.map((a, i) => (ai.push(parseInt(a))));
                    var hid = [0, 1, 2, 3, 4, 5, 6].filter(function (obj) { return ai.indexOf(obj) == -1; });
                    setTimeInterval(hid);
                }
            })
    }
    useEffect(() => {
        getJobs();
        getWorkerAvailabilty();
        getTime();
    }, []);


    let service_id;
    let complete_time;

    const handleServices = (value) => {
        const filtered = services.filter((s,i) => {
            if (i == value) {
                service_id = s.service;
                complete_time=parseFloat(s.jobHours);
                return s;
            } else {
                $('.services-' + i).css('display', 'none');
            }
        });
        setCTime(complete_time);
        setServices(filtered);
        setSelectedService(value);
        getWorkers();
        $('#edit-work-time').modal('hide')
    }
    const getWorkers = () => {
        axios
            .get(`/api/admin/all-workers?filter=true&service_id=${service_id}`, { headers })
            .then((res) => {
                setAllWorkers(res.data.workers);
            })
    }
    const handleSubmit = () => {

        let formdata = { 'workers': data, 'services': services ,'client_page':true};
        if (data.length > 0) {
            axios
                .post(`/api/admin/create-job/${params.id}`, formdata, { headers })
                .then((res) => {
                    alert.success(res.data.message)
                    setTimeout(() => {
                        navigate('/admin/jobs');
                    }, 1000);

                });
        } else {
            alert("Please Select the Workers");
        }

    }

    let curr = new Date
    let week = []
    let nextweek = []
    let nextnextweek = []
    for (let i = 0; i < 7; i++) {
        let first = curr.getDate() - curr.getDay() + i
        if (first >= curr.getDate()) {
            if (!interval.includes(i)) {
                let day = new Date(curr.setDate(first)).toISOString().slice(0, 10)
                week.push(day)
            }
        }
    }

    for (let i = 0; i < 7; i++) {
        if (!interval.includes(i)) {
            var today = new Date;
            var first = today.getDate() - today.getDay() + 7 + i;
            var firstday = new Date(today.setDate(first)).toISOString().slice(0, 10)
            nextweek.push(firstday)
        }
    }
    for (let i = 0; i < 7; i++) {
        if (!interval.includes(i)) {
            var today = new Date;
            var first = today.getDate() - today.getDay() + 14 + i;
            var firstday = new Date(today.setDate(first)).toISOString().slice(0, 10)
            nextnextweek.push(firstday)
        }
    }
    const slot = [
        ['8am-16pm', 'full day- 8am-16pm'],
        ['8am-10am', 'morning1 - 8am-10am'],
        ['10am-12pm', 'morning 2 - 10am-12pm'],
        ['8am-12pm', 'morning- 08am-12pm'],
        ['12pm-14pm', 'noon1 -12pm-14pm'],
        ['14pm-16pm', 'noon2 14pm-16pm'],
        ['12pm-16pm', 'noon 12pm-16pm'],
        ['16pm-18pm', 'af1 16pm-18pm'],
        ['18pm-20pm', 'af2 18pm-20pm'],
        ['16pm-20pm', 'afternoon 16pm-20pm'],
        ['20pm-22pm', 'ev1 20pm-22pm'],
        ['22pm-24am', 'ev2 22pm-24pm'],
        ['20pm-24am', 'evening 20pm-24am']
    ]
    const colourOptions = {
        '8am-16pm': [
            { value: 0, label: 'full day -8am-16pm' },
            { value: 1, label: 'morning1 -8am-10am' },
            { value: 2, label: 'morning 2 -10am-12pm' },
            { value: 3, label: 'morning -8am-12pm' },
            { value: 4, label: 'noon1   -12pm-14pm' },
            { value: 5, label: 'noon2 -14pm-16pm' },
            { value: 6, label: 'noon -12pm-16pm' },
            { value: 7, label: 'evening1 -16pm-18pm' },
            { value: 8, label: 'evening2 -18pm-20pm' },
            { value: 9, label: 'evening -16pm-20pm' },
            { value: 10, label: 'night1 -20pm-22pm' },
            { value: 11, label: 'night2 -22pm-24pm' },
            { value: 12, label: 'night -20pm-24pm' },
        ],
        '8am-12pm': [
            { value: 0, label: 'morning1 -8am-10am' },
            { value: 1, label: 'morning2 -10am-12pm' },
            { value: 2, label: 'morning  -8am-12pm' },
        ],
        '12pm-16pm': [
            { value: 0, label: 'af1 -12pm-14pm' },
            { value: 1, label: 'af2 -14pm-16pm' },
            { value: 2, label: 'afternoon -12pm-16pm' },
        ],
        '16pm-20pm': [
            { value: 0, label: 'ev1 -16pm-18pm' },
            { value: 1, label: 'ev2 -18pm-20pm' },
            { value: 2, label: 'Evening -16pm-20pm' },
        ],
        '20pm-24am': [
            { value: 0, label: 'night1 -20pm-22pm' },
            { value: 1, label: 'night2 -22pm-24pm' },
            { value: 2, label: 'night -20pm-24pm' },
        ],
    }
    const colourOptions1 = [
        { value: 0, label: 'full day - 8am-16pm' },
        { value: 1, label: 'morning - 8-12pm' },
    ]
    const changeShift = (w_id, date, e) => {
        let w_n = $('#worker-' + w_id).html();
        let filtered = data.filter((d) => {
                if (d.date == date && d.worker_id == w_id) {
                    return false;
                }else{
                    return d;
                }
        });
        let shifts = '';
        let value =false;
        e.map((v) => {
            if(v.label=='full day -8am-16pm'){
                  value = true;
                }
            if (shifts == '') {
                shifts = v.label;
            } else {
                if(value && [0,1,2,3,4,5,6].includes(v.value)){

                   Swal.fire(
                            "Warning!",
                            "Worker already assigned to full Day.",
                            "success"
                        );
                }else{
                shifts = shifts + ',' + v.label;
                }
            }
        });
       
        var newdata;
        if (shifts != '') {
            newdata = [...filtered, {
                worker_id: w_id,
                worker_name: w_n,
                date: date,
                shifts: shifts,
            }]

        } else {
            newdata = [...filtered]
        }
        setData(newdata);

    };
    const person = {
        '8am-16pm': "Full Day",
        '8am-12pm': "Morning",
        '12pm-16pm': 'Afternoon',
        '16pm-20pm': 'Evening',
        '20pm-24am': 'Night'
    };
    const filterOptions = (options, shifts) => {
        let new_options = [];
        let new_s = [];
        let new_end = [];
        let full_day = '';
        shifts.map((s, i) => {
            if ((s).split("-")[1] == '8am' && (s).split("-")[2] == '16pm') {
                full_day = s;
            }
            new_s.push((s).split("-")[1])
            new_end.push((s).split("-")[2])
        })
        if (full_day == '') {
            options.map((o, i) => {
                let check = true;
                if (options.length == 3 && i == 2 && new_s.length > 0) {
                    check = false;
                }
                if (options.length == 3 && new_s.length > 0 && new_s.includes((options[2].label).split("-")[1]) && new_end.includes((options[2].label).split("-")[2])) {
                    check = false;
                }
               
                if(c_time <= 2 && options.length != 3){
                   
                    if([0,3,6,9,12].includes(i)){
                    check = false;
                    }
                }
                if(c_time > 2 && c_time <= 4 && options.length != 3){
                   
                   if([0,1,2,4,5,7,8,10,11].includes(i)){
                     check = false;
                   }
                }
                if(c_time <= 2 && options.length == 3){
                   
                    if([2].includes(i)){
                    check = false;
                    }
                }
                if(c_time > 2 && c_time <= 4 && options.length == 3){
                  
                   if([0,1].includes(i)){
                     check = false;
                   }
                }

                if (check) {
                    if (!new_s.includes((o.label).split("-")[1])) {
                        new_options = [...new_options, {
                            value: o.value,
                            label: o.label,
                        }]
                    }
                }

            })
        }

        let remOptions = [];
        
        if(shifts.includes('morning 2 - 10am-12pm')){

            remOptions.push('morning1-8am-10am');
            remOptions.push('morning1-08am-10am');
            remOptions.push('morning2-10am-12pm');
        }

        if(shifts.includes('morning1 - 8am-10am')){

            remOptions.push('morning-8am-12pm');
           
        }
        
        if(shifts.includes('noon2 -14pm-16pm')){

            remOptions.push('noon1-12pm-14pm');
            remOptions.push('noon2-14pm-16pm');
        }

        if(shifts.includes('evening2 -18pm-20pm')){

            remOptions.push('evening1-16pm-18pmm');
            remOptions.push('evening2-18pm-20pm');
        }

        if(shifts.includes('night2 -22pm-24pm')){

            remOptions.push('night1-20pm-22pm');
            remOptions.push('night2-22pm-24pm');
        }

       
        for (var i = 0; i < new_options.length; i++) {
            var obj = new_options[i];

            
            if (remOptions.indexOf((obj.label).replace(/\s/g,'')) !== -1) {
                new_options.splice(i, 1);
            }

        }

        
        return new_options;

    }
    return (
        <>
          <ul className="nav nav-tabs mb-2" role="tablist">
            <li className="nav-item" role="presentation"><a id="worker-availability" className="nav-link active" data-toggle="tab" href="#tab-worker-availability" aria-selected="true" role="tab">Current Week</a></li>
            <li className="nav-item" role="presentation"><a id="current-job" className="nav-link" data-toggle="tab" href="#tab-current-job" aria-selected="true" role="tab">Next Week</a></li>
            <li className="nav-item" role="presentation"><a id="current-next-job" className="nav-link" data-toggle="tab" href="#tab-current-next-job" aria-selected="true" role="tab">Next Next Week</a></li>
        </ul>
        <div className="form-group text-right pr-2">
                <input type='button' value='View Job' className="btn btn-pink viewBtn" data-toggle="modal" data-target="#exampleModal" />
        </div>
        <div className='tab-content' style={{background: "#fff"}}>
             <div id="tab-worker-availability" className="tab-pane active show" role="tab-panel" aria-labelledby="current-job">
               <Table className='table table-bordered crt-jb'>
                <Thead>
                    <Tr>
                        <Th>Worker</Th>
                        {week.map((element, index) => (
                           <Td>
                               { moment(element).toString().slice(0,15) }
                           </Td>
                        ))}
                    </Tr>
                </Thead>
                <Tbody>
                    {AllWorkers.map((w, index) => {
                        let aval = (w.aval) ? w.aval : [];
                        let wjobs = (w.wjobs) ? w.wjobs : [];
                            return (
                                <Tr>
                                <Td>
                                    <span id={`worker-${w.id}`}>{w.firstname} {w.lastname}</span>
                                </Td>
                                {week.map((element, index) => {
                                    let shifts = (wjobs[element]) ? (wjobs[element]).split(",") : [];
                                    let sav = (shifts.length > 0 ) ?  filterOptions(colourOptions[aval[element]],shifts) : [];
                                    let list = (shifts.length > 0 ) ? true : false ;

                                    

                                        return ( <Td align="center" >
                                        {
                                            (list) ? 
                                            <span className="text-primary">{ 'Partial Day' }</span>

                                            :<span className="text-success">{person[aval[element]]}</span>
                                        }
                                        
                                        
                                        {shifts.map((s,i)=>{
                                            return (
                                                <div className="text-danger">{s}</div>
                                            )
                                        })}

                                        {list && sav.map((s,i)=>{
                                            return (
                                                <div className="text-success">{s.label}</div>
                                            )
                                        })}

                                        {(aval[element] && aval[element] != '')?
                                            <Select
                                                isMulti
                                                name="colors"
                                                options={filterOptions(colourOptions[aval[element]],shifts)}
                                                className="basic-multi-single "
                                                isClearable={true}
                                                classNamePrefix="select"
                                                onChange={(e)=>changeShift(w.id,element,e)}
                                            />
                                            :
                                            <div className="text-danger">Not Available</div>
                                            }
                                    </Td>
                                    )
                                    })}

                                </Tr>
                            )
                        })}
                </Tbody>
              </Table>
           </div>
               <div id="tab-current-job" className="tab-pane" role="tab-panel" aria-labelledby="current-job">
                  <Table className='table table-bordered crt-jb'>
                  <Tr>
                    <Td align="center">
                        Worker
                    </Td>
                   {nextweek.map((element, index) => (
                           <Td align="center">
                               { moment(element).toString().slice(0,15) }
                           </Td>
                        ))}
                  </Tr>
                  {AllWorkers.map((w, index) => {
                      let aval = (w.aval) ? w.aval : [];
                      let wjobs = (w.wjobs) ? w.wjobs : [];
                        return (
                            <Tr>
                               <Td align="center">
                                   <span id={`worker-${w.id}`}>{w.firstname} {w.lastname}</span>
                               </Td>
                               {nextweek.map((element, index) => {

                                   let shifts = (wjobs[element]) ? (wjobs[element]).split(",") : [];
                                   let sav = (shifts.length > 0 ) ?  filterOptions(colourOptions[aval[element]],shifts) : [];
                                    let list = (shifts.length > 0 ) ? true : false ;

                                    

                                        return ( <Td align="center" >
                                        {
                                            (list) ? 
                                            <span className="text-primary">{ 'Partial Day' }</span>

                                            :<span className="text-success">{person[aval[element]]}</span>
                                        }
                                        
                                        
                                        {shifts.map((s,i)=>{
                                            return (
                                                <div className="text-danger">{s}</div>
                                            )
                                        })}

                                        {list && sav.map((s,i)=>{
                                            return (
                                                <div className="text-success">{s.label}</div>
                                            )
                                        })}
                                       
                                        {(aval[element] && aval[element] != '')?
                                        <Select
                                            isMulti
                                            name="colors"
                                            options={filterOptions(colourOptions[aval[element]],shifts)}
                                            className="basic-multi-single"
                                            isClearable={true}
                                            classNamePrefix="select"
                                            onChange={(e)=>changeShift(w.id,element,e)}
                                          />
                                          :
                                          <div className="text-danger">Not Available</div>
                                         }
                                   </Td>
                                   )
                                })}

                             </Tr>
                         )
                    })}

              </Table>

               </div>
                <div id="tab-current-next-job" className="tab-pane" role="tab-panel" aria-labelledby="current-job">
                  <Table className='table table-bordered crt-jb'>
                  <Tr>
                    <Td align="center">
                        Worker
                    </Td>
                   {nextnextweek.map((element, index) => (
                           <Td align="center">
                               { moment(element).toString().slice(0,15) }
                           </Td>
                        ))}
                  </Tr>
                  {AllWorkers.map((w, index) => {
                      let aval = (w.aval) ? w.aval : [];
                      let wjobs = (w.wjobs) ? w.wjobs : [];
                        return (
                            <Tr>
                               <Td align="center">
                                  <span id={`worker-${w.id}`}>{w.firstname} {w.lastname}</span>
                               </Td>
                               {nextnextweek.map((element, index) => {
                                   let shifts = (wjobs[element]) ? (wjobs[element]).split(",") : [];
                                    let sav = (shifts.length > 0 ) ?  filterOptions(colourOptions[aval[element]],shifts) : [];
                                    let list = (shifts.length > 0 ) ? true : false ;

                                    

                                        return ( <Td align="center" >
                                        {
                                            (list) ? 
                                            <span className="text-primary">{ 'Partial Day' }</span>

                                            :<span className="text-success">{person[aval[element]]}</span>
                                        }
                                        
                                        
                                        {shifts.map((s,i)=>{
                                            return (
                                                <div className="text-danger">{s}</div>
                                            )
                                        })}

                                        {list && sav.map((s,i)=>{
                                            return (
                                                <div className="text-success">{s.label}</div>
                                            )
                                        })}
                                        
                                         {(aval[element] && aval[element] != '')?
                                        <Select
                                            isMulti
                                            name="colors"
                                            options={filterOptions(colourOptions[aval[element]],shifts)}
                                            className="basic-multi-single"
                                            isClearable={true}
                                            classNamePrefix="select"
                                            onChange={(e)=>changeShift(w.id,element,e)}
                                          />
                                          :
                                          <div className="text-danger">Not Available</div>
                                         }
                                   </Td>
                                   )
                                })}

                             </Tr>
                         )
                    })}

              </Table>

               </div>
           </div>
            <div className="form-group text-center">
                <input type='button' value='View Job' className="btn btn-pink" data-toggle="modal" data-target="#exampleModal" />
            </div>
            <div className="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">View Job</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">

                            <div className="row">
                                <div className="table-responsive">
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th scope="col">Client Name</th>
                                                <th scope="col">Services</th>
                                                <th scope="col">Frequency</th>
                                                <th scope="col">Complete Time</th>
                                            </tr>

                                        </thead>
                                        <tbody>
                                            <td>{clientname}</td>
                                            <td> {services &&
                                                services.map((item, index) => {

                                                    if(item.service == '10')
                                                    return(<p>{item.other_title}</p>)
                                                    else
                                                    return(<p>{item.name}</p>)
                                                }
                                                )}</td>
                                            <td>{services &&
                                                services.map((item, index) => (

                                                    <p>{item.freq_name}</p>
                                                )
                                                )}</td>
                                            <td>{services &&
                                                services.map((item, index) => (

                                                    <p>{item.jobHours} hours</p>
                                                )
                                                )}</td>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="table-responsive">
                                    {data.length > 0 ? (
                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Worker Name</th>
                                                    <th scope="col">Data</th>
                                                    <th scope="col">Shifts</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data && data.map((d, i) =>
                                                (
                                                    <tr key={i}>
                                                        <td>
                                                            {d.worker_name}
                                                        </td>
                                                        <td>
                                                            {d.date}
                                                        </td>
                                                        <td>
                                                            {d.shifts}
                                                        </td>
                                                    </tr>
                                                )
                                                )}
                                            </tbody>
                                        </table>
                                    ) : ''}
                                </div>

                            </div>


                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary closeb" data-dismiss="modal">Close</button>
                            <button type="button" onClick={handleSubmit} className="btn btn-primary" data-dismiss="modal">Save and Send</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="edit-work-time" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Select Service</h5>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-sm-12">
                                    <label className="control-label">
                                        Services
                                    </label>
                                    <select value={selected_service} onChange={(e) =>
                                        handleServices(e.target.value)
                                    } className="form-control">
                                        <option value="">Please Select Service</option>
                                        {services &&
                                            services.map((item, index) => {
                                                if (item.service != '10')
                                                    return (
                                                        <option value={index}>{item.name} </option>
                                                    )
                                                else
                                                    return (
                                                        <option value={index}>{item.other_title} </option>
                                                    )
                                            }
                                            )}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

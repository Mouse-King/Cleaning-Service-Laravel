import React,{useState,useEffect, useTransition} from 'react'
import { useAlert } from "react-alert";
import moment from 'moment-timezone';
import { useParams,useNavigate,Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export default function WorkerAvailabilty() {
    const [worker_aval, setWorkerAval] = useState([])
    const [errors, setErrors] = useState([])
    const [interval, setTimeInterval] = useState([]);
     const [AllDates,setAllDates] = useState([]);
    const params = useParams();
    const navigate = useNavigate();
    const alert = useAlert();
    const id = localStorage.getItem('worker-id');
    const {t} = useTranslation();
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("worker-token"),
    };
    let handleChange = (event,w_date, slot) => {
     
         let newworker = worker_aval;
         if(not_available_date.includes(w_date)){
           alert.error("You Can't Select this Date");
            return false;
         }
         
         Array.from(document.getElementsByClassName(w_date)).forEach(
              function(element, index, array) {
                  element.childNodes[0].childNodes[1].classList.remove("checked_forcustom")
              }
          );
         if((event.target.name).toString()==='true'){
            document.getElementById(event.target.id).setAttribute('name',!event.target.checked);
            document.getElementById(event.target.id).parentNode.childNodes[1].classList.add("checked_forcustom");
            if(newworker[w_date]===undefined){
              newworker[w_date]=[slot];
            }else{
              newworker[w_date]=[slot];
            }
        }else{
           document.getElementById(event.target.id).setAttribute('name',!event.target.checked);
            document.getElementById(event.target.id).parentNode.childNodes[1].classList.remove("checked_forcustom");
            let newarray =[]
             newworker[`${w_date}`].filter( (e) => { 
                    if(e !== slot){
                      newarray.push(e)
                    }
               })
             newworker[w_date]=newarray;
        }
        setWorkerAval(newworker);
    }
    let handleSubmit = () =>{
        let newworker = Object.assign({}, worker_aval);
        let newworker1=Object.assign({}, {'data':newworker});
       axios
            .post(`/api/update_availability/${id}`, newworker1, { headers })
            .then((response) => {
                if (response.data.errors) {
                    setErrors(response.data.errors);
                } else {
                    alert.success("Availabilty Updated Successfully");
                    getWorkerAvailabilty();
                }
            });


    }

    let curr = new Date 
    let week = []
    let nextweek = []
    let nextnextweek = []
    for (let i = 0; i < 7; i++) {
      let first = curr.getDate() - curr.getDay() + i 
      if(first>=curr.getDate()){
        if(!interval.includes(i)){
          let day = new Date(curr.setDate(first)).toISOString().slice(0, 10)
          week.push(day)
        }
      }
    }
    
    for (let i = 0; i < 7; i++) {
      if(!interval.includes(i)){
      var today = new Date;
       var first = today.getDate() - today.getDay() + 7+i;
       var firstday = new Date(today.setDate(first)).toISOString().slice(0, 10)
        nextweek.push(firstday)
     }
    }
     for (let i = 0; i < 7; i++) {
      if(!interval.includes(i)){
      var today = new Date;
       var first = today.getDate() - today.getDay() + 14+i;
       var firstday = new Date(today.setDate(first)).toISOString().slice(0, 10)
        nextnextweek.push(firstday)
     }
    }
   // const slot = [
   //   ['8am-16pm','full day- 8am-16pm'],
   //   ['8am-10am','morning1 - 8am-10am'],
   //   ['10am-12pm','morning 2 - 10am-12pm'],
   //   ['12pm-14pm','noon1 -12pm-14pm'],
   //   ['14pm-16pm','noon2 14pm-16pm'],
   //   ['12pm-16pm','noon 12pm-16pm'],
   //   ['16pm-18pm','af1 16pm-18pm'],
   //   ['18pm-20pm','af2 18pm-20pm'],
   //   ['16pm-20pm','afternoon 16pm-20pm'],
   //   ['20pm-22pm','ev1 20pm-22pm'],
   //   ['22pm-24am','ev2 22pm-24pm'],
   //   ['20pm-24am','evening 20pm-24am']
   //  ]
    const slot = [
     ['8am-16pm','Full Day'],
     ['8am-12pm','Morning'],
     ['12pm-16pm','Afternoon'],
     ['16pm-20pm','Evening'],
     ['20pm-24am','Night']
    ]

     const getWorkerAvailabilty = () => {
        axios
            .get(`/api/worker_availability/${id}`, { headers })
            .then((response) => {
                if(response.data.availability){
                    setWorkerAval(response.data.availability);
                }
            });
    };
    const getTime = () => {
        axios
            .get(`/api/get-time`, { headers })
            .then((res) => {
                if (res.data.time.length > 0) {
                    let ar = JSON.parse(res.data.time[0].days);
                    let ai = [];
                    ar && ar.map((a, i) => (ai.push(parseInt(a))));
                    var hid = [0, 1, 2, 3, 4, 5, 6].filter(function (obj) { return ai.indexOf(obj) == -1; });
                    setTimeInterval(hid);
                }
            })
    }
    const getDates = () =>{
      axios
      .post(`/api/get-not-available-dates`,{id:localStorage.getItem("worker-id")},{ headers })
      .then((res)=>{
        setAllDates(res.data.dates);
      })
    }
    useEffect(() => {
        getWorkerAvailabilty();
        getTime();
        getDates();
    }, []);
     let not_available_date = [];
    AllDates.map((d)=>{
          not_available_date.push(d.date); 
    });
  return (
    <div className="boxPanel">
        <ul className="nav nav-tabs" role="tablist">
            <li className="nav-item" role="presentation"><a id="current-week" className="nav-link active" data-toggle="tab" href="#tab-current-week" aria-selected="true" role="tab">{t('worker.schedule.c_week')}</a></li>
            <li className="nav-item" role="presentation"><a id="first-next-week" className="nav-link" data-toggle="tab" href="#tab-first-next-week" aria-selected="true" role="tab">{t('worker.schedule.n_week')}</a></li>
            <li className="nav-item" role="presentation"><a id="first-next-week" className="nav-link" data-toggle="tab" href="#tab-first-next-next-week" aria-selected="true" role="tab">Next Next Week</a></li>
        </ul>
         <div className='tab-content maxWidth770' style={{background: "#fff"}}>
         <div id="tab-current-week" className="tab-pane active show" role="tab-panel" aria-labelledby="current-week">
            <div className="table-responsive">
              <table className="timeslots table">
                <thead>
                  <tr>
                    {week.map((element, index) => (
                       <th key={index}>{ moment(element).toString().slice(0,15) }</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                {slot.map((s, index) => (
                  <tr key={index}>
                    {week.map((w, index) => (
                    <td key={index}>
                      <div className={w} >
                        <label>
                          <input type="checkbox" data-day="Sunday" className="btn-check" id={w+'-'+s['0']} data-value={w} value={s['0']} onChange={(e)=>handleChange(e,w,s['0'])} name={((worker_aval[`${w}`] !== undefined)?!worker_aval[`${w}`].includes(s['0']):true).toString()} />
                          <span className={(worker_aval[`${w}`] !== undefined)?((worker_aval[`${w}`].includes(s['0']))?'forcustom checked_forcustom':'forcustom'):'forcustom'}>{s['1']}</span>
                        </label>
                      </div>
                    </td>
                    ))}
                  </tr>
                  ))}
                </tbody>
              </table>
            </div>
       </div>
       <div id="tab-first-next-week" className="tab-pane" role="tab-panel" aria-labelledby="first-next-week">
            <div className="table-responsive">
              <table className="timeslots table">
                <thead>
                  <tr>
                    {nextweek.map((element, index) => (
                       <th key={index}>{ moment(element).toString().slice(0,15) }</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                {slot.map((s, index) => (
                 <tr key={index}>
                    {nextweek.map((w, index) => (
                    <td key={index}>
                      <div className={w} >
                        <label>
                          <input type="checkbox" data-day="Sunday" className="btn-check" id={w+'-'+s['0']} data-value={w} value={s['0']} onChange={(e)=>handleChange(e,w,s['0'])} name={((worker_aval[`${w}`] !== undefined)?!worker_aval[`${w}`].includes(s['0']):true).toString()} />
                          <span className={(worker_aval[`${w}`] !== undefined)?((worker_aval[`${w}`].includes(s['0']))?'forcustom checked_forcustom':'forcustom'):'forcustom'}>{s['1']}</span>
                        </label>
                      </div>
                    </td>
                    ))}
                  </tr>
                  ))}
                </tbody>
              </table>
            </div>
       </div>
        <div id="tab-first-next-next-week" className="tab-pane" role="tab-panel" aria-labelledby="first-next-week">
            <div className="table-responsive">
              <table className="timeslots table">
                <thead>
                  <tr>
                    {nextnextweek.map((element, index) => (
                       <th key={index}>{ moment(element).toString().slice(0,15) }</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                {slot.map((s, index) => (
                 <tr key={index}>
                    {nextnextweek.map((w, index) => (
                    <td key={index}>
                      <div className={w} >
                        <label>
                          <input type="checkbox" data-day="Sunday" className="btn-check" id={w+'-'+s['0']} data-value={w} value={s['0']} onChange={(e)=>handleChange(e,w,s['0'])} name={((worker_aval[`${w}`] !== undefined)?!worker_aval[`${w}`].includes(s['0']):true).toString()} />
                          <span className={(worker_aval[`${w}`] !== undefined)?((worker_aval[`${w}`].includes(s['0']))?'forcustom checked_forcustom':'forcustom'):'forcustom'}>{s['1']}</span>
                        </label>
                      </div>
                    </td>
                    ))}
                  </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div>
      </div>
      <div className="text-center mt-3">
        <input type="button" value={t('worker.schedule.update')} className="btn btn-primary" onClick={handleSubmit}/>
      </div>
     
    </div>
  )
}

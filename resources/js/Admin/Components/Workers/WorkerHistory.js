import React,{useState,useEffect} from 'react'
import { useParams,Link } from "react-router-dom";
import CurrentJob from './CurrentJob'
import PastJob from './PastJob'
import WorkerAvailabilty from './WorkerAvailabilty'
import Documents from './Documents'
import WorkerContract from './WorkerContract'
import WorkerNotAvailabilty from './WorkerNotAvailabilty'

export default function WorkerHistory() {
    const params = useParams();
     const [interval, setTimeInterval] = useState([]);
     const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };
     const getTime = () => {
        axios
            .get(`/api/admin/get-time`, { headers })
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
     useEffect(() => {
        getTime();
    }, []);
    
  return (
    <div className='ClientHistory'>
        <ul className="nav nav-tabs" role="tablist">
            <li className="nav-item" role="presentation"><a id="worker-availability" className="nav-link active" data-toggle="tab" href="#tab-worker-availability" aria-selected="true" role="tab">Worker Availability</a></li>
            <li className="nav-item" role="presentation"><a id="current-job" className="nav-link" data-toggle="tab" href="#tab-current-job" aria-selected="true" role="tab">Current Job</a></li>
            <li className="nav-item" role="presentation"><a id="past-job" className="nav-link" data-toggle="tab" href="#tab-past-job" aria-selected="false" role="tab">Past Job</a></li>
            <li className="nav-item" role="presentation"><a id="doucments" className="nav-link" data-toggle="tab" href="#tab-doucments" aria-selected="false" role="tab">Form 101</a></li>
            <li className="nav-item" role="presentation"><a id="worker-contract" className="nav-link" data-toggle="tab" href="#tab-worker-contract" aria-selected="false" role="tab">Contract</a></li>
            <li className="nav-item" role="presentation"><a id="worker-not-availability" className="nav-link" data-toggle="tab" href="#tab-worker-not-availability" aria-selected="false" role="tab">Not Available Date</a></li>
        </ul>
        <div className='tab-content' style={{background: "#fff"}}>
             <div id="tab-worker-availability" className="tab-pane active show" role="tab-panel" aria-labelledby="current-job"><WorkerAvailabilty interval={interval}/></div>
            <div id="tab-current-job" className="tab-pane" role="tab-panel" aria-labelledby="current-job"><CurrentJob/></div>
            <div id="tab-past-job" className="tab-pane" role="tab-panel" aria-labelledby="past-job"><PastJob/></div>
            <div id="tab-doucments" className="tab-pane" role="tab-panel" aria-labelledby="doucments"><Documents/></div>
            <div id="tab-worker-contract" className="tab-pane" role="tab-panel" aria-labelledby="doucments"><WorkerContract/></div>
            <div id="tab-worker-not-availability" className="tab-pane" role="tab-panel" aria-labelledby="doucments"><WorkerNotAvailabilty/></div>
        </div>
    </div>
  )
}

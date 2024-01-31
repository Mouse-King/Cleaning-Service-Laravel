import React,{ useState,useEffect } from 'react'
import { useParams } from 'react-router-dom';

export default function WorkerContract() {

    const params  = useParams();
    const [signature2, setSignature2] = useState(null);

    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };
    const getWorker = () =>{
        axios
        .get(`/api/admin/workers/${params.id}/edit`,{ headers })
        .then((res)=>{

            if(res.data.worker){
               let w = res.data.worker;
               setSignature2(w.worker_contract);
            }
        })
    }

    useEffect(()=>{
        getWorker();
    },[]);
  return (
    <div className='container'>
        {signature2 ? 
         <div>
          <button type="button" className="btn btn-success m-3">Signed</button>
          <a href={`/admin/worker-contract/${params.id}`} className="btn btn-pink" target="_blank">View Contract</a>
         </div>
        :
       <button type="button" className="btn btn-danger">Not Signed </button>
       }
    </div>
  )
}

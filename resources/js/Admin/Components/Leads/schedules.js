import React,{ useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Moment from 'moment';
import Swal from 'sweetalert2';

export default function ScheduledMeeting() {

    const [schedules,setSchedules] = useState([]);
    const [loading,setLoading]     = useState('Loading..');
    const param = useParams();
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };

    const getSchedules = ()=>{
        axios
        .post(`/api/admin/client-schedules`,{id:param.id},{ headers })
        .then((res)=>{
            if(res.data.schedules.length > 0){
               setSchedules(res.data.schedules);
            } else {
                setLoading('No meeting scheduled yet.')
            }
        })
    };
    useEffect(()=>{
        getSchedules();
    },[]);

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Delete Meeting!",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`/api/admin/schedule/${id}`, { headers })
                    .then((response) => {
                        Swal.fire(
                            "Deleted!",
                            "Meeting has been deleted.",
                            "success"
                        );
                        setTimeout(() => {
                            getSchedules();
                        }, 1000);
                    });
            }
        });
    };
   
    const copy = [...schedules];
    const [order,setOrder] = useState('ASC');
    const sortTable = (e,col) =>{
        
        let n = e.target.nodeName;

        if (n == "TH") {
            let q = e.target.querySelector('span');
            if (q.innerHTML === "↑") {
                q.innerHTML = "↓";
            } else {
                q.innerHTML = "↑";
            }

        } else {
            let q = e.target;
            if (q.innerHTML === "↑") {
                q.innerHTML = "↓";
            } else {
                q.innerHTML = "↑";
            }
        }

        if(order == 'ASC'){
            const sortData = [...copy].sort((a, b) => (a[col] < b[col] ? 1 : -1));
            setSchedules(sortData);
            setOrder('DESC');
        }
        if(order == 'DESC'){
            const sortData = [...copy].sort((a, b) => (a[col] < b[col] ? -1 : 1));
            setSchedules(sortData);
            setOrder('ASC');
        }
        
    }

  return (
    <div className="boxPanel">
        <div className="table-responsive"> 
        { schedules.length > 0 ? (
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th onClick={(e)=>{ sortTable(e,'id') }} style={{cursor:'pointer'}}>ID <span className='arr'> &darr; </span></th>
                        <th>Meeting Attender</th>
                        <th onClick={(e)=>{ sortTable(e,'start_date') }} style={{cursor:'pointer'}} >Scheduled <span className='arr'> &darr; </span></th>
                        <th onClick={(e)=>{ sortTable(e,'booking_status') }} style={{cursor:'pointer'}}>Status <span className='arr'> &darr; </span></th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>   
                    { schedules && schedules.map((item,i)=>{

                        let color =  "";         
                        if(item.booking_status == 'pending') { color = 'purple' }
                        else if(item.booking_status == 'confirmed' || item.booking_status == 'completed') { color =  'green'}
                        else {color = 'red'}

                        return (
                    <tr>
                        <td>#{item.id}</td>
                        <td>
                            {
                                item.team
                                ? item.team.name
                                :"NA"
                            }
                        </td>
                        <td> 
                            {
                                Moment(item.start_date).format('DD/MM/Y')
                            }
                            <br/>
                            {
                                Moment(item.start_date).format('dddd')
                            }
                            <br/>
                            {
                                "Start : " + item.start_time
                            }
                            <br/>
                            {
                                "End : " + item.end_time
                            }
                        </td>
                        <td style={{color}}>{ item.booking_status}</td>
                        <td>
                            <div className="d-flex">   
                                <Link to={`/admin/view-schedule/${param.id}?sid=${item.id}`} className="btn bg-yellow"><i className="fa fa-eye"></i></Link>
                                <button className="ml-2 btn bg-red" onClick={() => handleDelete( item.id )}><i className="fa fa-trash"></i></button>                            
                            </div>
                        </td>
                    </tr>   
                        )
                    }) }    
                      
                </tbody>
            </table>
        ):(
            <div className="form-control text-center">{loading}</div>
        )}
        </div>
    </div>
  )
}

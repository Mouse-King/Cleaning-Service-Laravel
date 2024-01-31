import React, { useEffect, useState } from 'react'
import Sidebar from '../../../Layouts/Sidebar'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAlert } from 'react-alert';

export default function ManageTime() {
    const [time, setTime] = useState([]);
    const alert = useAlert();
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };
    const handleSubmit = (e) => {
        e.preventDefault();

        const days = document.querySelectorAll('input[name="days[]"]:checked');
        const start = document.querySelector('#timing_starts').value;
        const end = document.querySelector('#timing_ends').value;

        const d_ar = []; let u_days = [];
        (days.length > 0) ?
            days.forEach((d, i) => {
                d_ar.push(d.value);
            })
            : '';
        (d_ar.length > 0) ?
            u_days = JSON.stringify(d_ar)
            : [];

        const data = {
            start_time: start,
            end_time: end,
            days: u_days,
        }
        
        axios
        .post(`/api/admin/update-time`,data,{ headers })
        .then((res)=>{
            if(res.data.errors){
              for(let e in res.data.errors){
                alert.error(res.data.errors[e]);
              }
            } else {
                alert.success(res.data.message);
            }
         
        })

    }
    const getTime = () => {
        axios
            .get(`/api/admin/get-time`, { headers })
            .then((res) => {
                (res.data.time.length > 0) ?
                    setTime(res.data.time)
                    : setTime([]);
            })
    }

    useEffect(() => {
        getTime();
    }, []);

    const ds = document.querySelectorAll('input[type="checkbox"]');
    const st = document.querySelector('#timing_starts');
    const et = document.querySelector('#timing_ends');
    time && time.map((t, i) => {
        let aday = (t.days) ? JSON.parse(t.days) : [];
        aday.includes('0') ? ds[0].setAttribute('checked', true) : '';
        aday.includes('1') ? ds[1].setAttribute('checked', true) : '';
        aday.includes('2') ? ds[2].setAttribute('checked', true) : '';
        aday.includes('3') ? ds[3].setAttribute('checked', true) : '';
        aday.includes('4') ? ds[4].setAttribute('checked', true) : '';
        aday.includes('5') ? ds[5].setAttribute('checked', true) : '';
        aday.includes('6') ? ds[6].setAttribute('checked', true) : '';
         st.value = t.start_time;
         et.value = t.end_time;
    });
    return (
        <div id="container">
            <Sidebar />
            <div id="content">
                <div className="titleBox customer-title">
                    <div className="row">
                        <div className="col-sm-6">
                            <h1 className="page-title">Manage Time</h1>
                        </div>
                        <div className="col-sm-6">
                            <div className="search-data">
                                <button className="btn btn-danger addButton" onClick={(e) => handleSubmit(e)}><i className="btn-icon fas fa-upload"></i>Update</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card">

                    <div className="card-body">
                        <div className="form-group">
                            <label for="days">Open Days</label>
                            <br />

                            <div className="form-check form-check-inline">

                                <input className="form-check-input" type="checkbox" id="sunday" name="days[]" value="0" />

                                <label className="form-check-label" for="sunday">Sunday</label>

                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" id="monday" name="days[]" value="1" />
                                <label className="form-check-label" for="monday">Monday</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" id="tuesday" name="days[]" value="2" />
                                <label className="form-check-label" for="tuesday">Tuesday</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" id="wednesday" name="days[]" value="3" />
                                <label className="form-check-label" for="wednesday">Wednesday</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" id="thursday" name="days[]" value="4" />
                                <label className="form-check-label" for="thursday">Thursday</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" id="friday" name="days[]" value="5" />
                                <label className="form-check-label" for="friday">Friday</label>
                            </div>
                            <div className="form-check form-check-inline">
                                <input className="form-check-input" type="checkbox" id="saturday" name="days[]" value="6" />
                                <label className="form-check-label" for="saturday">Saturday</label>
                            </div>

                        </div>

                        <div className="form-group">
                            <label for="timing_starts">Timing Starts at</label>
                            <input type="time" className="form-control" id="timing_starts" name="timing_starts" placeholder="Enter Start Timing" />
                        </div>
                        <div className="form-group">
                            <label for="timing_starts">Timing Ends at</label>
                            <input type="time" className="form-control" id="timing_ends" name="timing_ends" placeholder="Enter End Timing" />
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}

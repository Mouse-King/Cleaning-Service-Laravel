import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import Moment from 'moment';
import { useTranslation } from "react-i18next";
import i18next from 'i18next';
import { Base64 } from "js-base64";
import logo from "../Assets/image/sample.svg";
import DatePicker from 'react-datepicker';
import { useAlert } from 'react-alert';

export default function ScheduleMeet() {

    const { t } = useTranslation();
    const [meeting, setMeeting] = useState([]);
    const [ClientName, setClientName] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [client, setClient] = useState([]);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [phase, setPhase] = useState(1);

    const param = useParams();
    const alert = useAlert();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(window.location.search);
    const sid = queryParams.get("sid");
    const time = [
        "08:00 AM",
        "08:30 AM",
        "09:00 AM",
        "09:30 AM",
        "10:00 AM",
        "10:30 AM",
        "11:00 AM",
        "11:30 AM",
        "12:00 PM",
        "12:30 PM",
        "01:00 PM",
        "01:30 PM",
        "02:00 PM",
        "02:30 PM",
        "03:00 PM",
        "03:30 PM",
        "04:00 PM",
        "04:30 PM",
        "05:00 PM",
        "05:30 PM"
    ];

    const getClient = () => {

        axios
            .post(`/api/client/get-client`, { id: Base64.decode(param.id) })
            .then((res) => {
                let c = res.data.client;

                i18next.changeLanguage(c.lng);
                
                if(c.lng == 'heb'){
                 import('../Assets/css/rtl.css');
                 document.querySelector('html').setAttribute('dir','rtl');
                } else{
                 document.querySelector('html').removeAttribute('dir');
                }

                setClient(c);
                setClientName(c.firstname + " " + c.lastname);
            });
    }

    const dt = Moment(meeting.start_date).format('DD-MM-Y');

    const sendMeeting = () => {

        if (startTime == '') {
            alert.error('Please select start time');
            return;
        }
        if (endTime == '') {
            alert.error('Please select end time');
            return;
        }

        const data = {
            client: client,
            startDate: Moment(startDate).toDate(),
            startTime: startTime,
            endTime: endTime
        };


        axios
            .post('/api/client/add-meet', { data })
            .then((res) => {
                setPhase(0);
            });


    }

    const getSchedule = () => {

        axios
            .get(`/api/client/get-schedule/${Base64.decode(param.id)}`)
            .then((res) => {
                if (res.data.status_code == 200) {
                    setPhase(0);
                    let s = res.data.schedule;
                    setStartDate(Moment(s.start_date).toDate());
                    setStartTime(s.start_time);
                    setEndTime(s.end_time);

                }
            });
    }

    useEffect(() => {
        getClient();
        getSchedule();
        setTimeout(() => {
            document.querySelector(".meeting").style.display = "block";
        }, 1000)

    }, []);
    return (
        <div className='container meeting' style={{ display: "none" }}>

            <div className='thankyou meet-status dashBox maxWidthControl p-4'>
                <svg width="190" height="77" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                    <image xlinkHref={logo} width="190" height="77"></image>
                </svg>

                <h1>{ClientName}</h1>
                <div className='mSchedule'>
                    <h4>{t('front_meet.title')}</h4>
                    {phase == 1 && (
                        <>
                            <div className='row'>
                                <div className='col-sm-4'>
                                    <div className='form-group'>
                                        <label>{t('front_meet.date')}</label>
                                        <DatePicker dateFormat="dd/MM/Y" selected={startDate} id="dateSel" className='form-control' onChange={(date) => { setStartDate(date); }} />
                                    </div>
                                </div>
                                <div className='col-sm-4'>
                                    <div className='form-group'>
                                        <label>{t('front_meet.start')}</label>
                                        <select name="start_time" id="start_time" onChange={(e) => { setStartTime(e.target.value); }} className="form-control">
                                            <option>{t('front_meet.op_start')}</option>
                                            {time && time.map((t, i) => {
                                                return (<option value={t} selected={t == startTime}>{t}</option>);
                                            })}

                                        </select>
                                    </div>
                                </div>
                                <div className='col-sm-4'>
                                    <div className='form-group'>
                                        <label>{t('front_meet.end')}</label>
                                        <select name="end_time" id="end_time" selected={endTime} onChange={(e) => { setEndTime(e.target.value); }} className="form-control">
                                            <option>{t('front_meet.op_end')}</option>
                                            {time && time.map((t, i) => {
                                                return (<option value={t} selected={t == endTime}>{t}</option>);
                                            })}
                                        </select>
                                    </div>
                                </div>

                            </div>


                            <div className='text-center mt-3'>
                                <button className='btn btn-pink sendBtn' onClick={sendMeeting}>{t('front_meet.btn')}</button>
                            </div>
                        </>


                    )
                    }
                    {phase == 0 && (
                        <>

                            <div className='row'>
                                <div className='col-sm-4'>
                                    <div className='form-group'>
                                        <label>{t('front_meet.date')}</label>
                                        <DatePicker dateFormat="dd/MM/Y" selected={startDate} id="dateSel" className='form-control' onChange={(date) => { setStartDate(date); }} />
                                    </div>
                                </div>
                                <div className='col-sm-4'>
                                    <div className='form-group'>
                                        <label>{t('front_meet.start')}</label>
                                        <select name="start_time" id="start_time" onChange={(e) => { setStartTime(e.target.value); }} className="form-control">
                                            <option>{t('front_meet.op_start')}</option>
                                            {time && time.map((t, i) => {
                                                return (<option value={t} selected={t == startTime}>{t}</option>);
                                            })}

                                        </select>
                                    </div>
                                </div>
                                <div className='col-sm-4'>
                                    <div className='form-group'>
                                        <label>{t('front_meet.end')}</label>
                                        <select name="end_time" id="end_time" selected={endTime} onChange={(e) => { setEndTime(e.target.value); }} className="form-control">
                                            <option>{t('front_meet.op_end')}</option>
                                            {time && time.map((t, i) => {
                                                return (<option value={t} selected={t == endTime}>{t}</option>);
                                            })}
                                        </select>
                                    </div>
                                </div>

                            </div>

                        </>
                    )

                    }
                </div>

            </div>
        </div>
    )
}

import React, { useState, useEffect } from 'react'
import Sidebar from '../../Layouts/Sidebar'
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useAlert } from 'react-alert';
import { Link } from "react-router-dom";
import moment from 'moment';
import { template } from 'lodash';

export default function chat() {

    const [data, setData] = useState(null);
    const [messages, setMessages] = useState(null);
    const [selectNumber, setSelectNumber] = useState(null);
    const [clients, setClients] = useState(null);
    const [expired, setExpired] = useState(0);

    const alert = useAlert();
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };


    const getData = () => {

        axios
            .get(`/api/admin/chats`, { headers })
            .then((res) => {
                const r = res.data.data;
                setClients(res.data.clients)
                setData(r);
            });
    }

    const getMessages = (no) => {

        axios
            .get(`/api/admin/chat-message/${no}`, { headers })
            .then((res) => {
                const c = res.data.chat;
                let cl = localStorage.getItem('chatLen');
                if (cl > c.length) {
                    scroller();
                }

                localStorage.setItem('chatLen', c.length);
                setExpired(res.data.expired);
                setMessages(c);
               
            });

    }

    const sendMessage = () => {

        let msg = document.getElementById('message_typing').value;
        if (msg == '') {
            alert.error('Please type message');
            return;
        }
        if (selectNumber == null) {
            alert.error('Please open chat of number');
            return;
        }
        const send = {
            number: selectNumber,
            message: msg,
            expired: expired
        };
        axios
            .post(`/api/admin/chat-reply`, send, { headers })
            .then((res) => {
                document.getElementById('message_typing').value = '';
                getData();
                setTimeout(() => { scroller(); }, 200);
            });
    }

    const callApi = () => {

        const interval = setInterval(() => {

            getMessages(localStorage.getItem('number'));

        }, 2000);
        return () => clearInterval(interval);

    }

    const scroller = () => {

        var objDiv = document.getElementById("ko");
        objDiv.scrollTop = objDiv.scrollHeight;
    }

    const restartChat = () => {
        let template = document.getElementById('template').value;
        let number = localStorage.getItem('number');
        if (template == '') {
            window.alert('Please select template');
            return;
        }

        const data = {
            template: template,
            number: number
        };
        axios
            .post(`/api/admin/chat-restart`, data, { headers })
            .then((res) => {
                $('#cbtn').click();
                setExpired(0);
                getMessages(number);
                setTimeout(() => { scroller(); }, 200);
            });

    }

    const search = (s) =>{
     
        axios.get(`/api/admin/chat-search?s=${s}`,{headers})
        .then((res)=>{
            const r = res.data.data;
            setClients(res.data.clients)
            setData(r);
        })
    }

    useEffect(() => {
        getData();
        callApi();
    }, []);


    return (
        <div id="container">
            <Sidebar />
            <div id="content">
                <div className="view-applicant">
                    <div className='row'>

                        <div className='col-sm-6'>
                            <h1 className="page-title">Chat History</h1>
                        </div>
                        <div className='col-sm-6 text-right page-title'>
                           
                                <input type="text" name="smsg" className='form-control' onChange={e=>search(e.target.value)} placeholder='search name or number' style={{float:'right',width:'55%'}}/>
                         
                        </div>

                    </div>

                    <div className='card'>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-sm-9">
                                    <h4 className="header-title mb-3">Replies</h4><hr />
                                    <div className="chat-conversation">
                                        <div data-simplebar="init" style={{ height: "600px" }}>
                                            <div className="simplebar-wrapper" style={{ margin: "0px" }}>
                                                <div chat-content="" id="ko" style={{ overflowY: "scroll", width: "auto", height: "580px" }}>
                                                    <div className="simplebar-content" style={{ padding: "0px" }}>
                                                        <ul className="conversation-list" style={{ fontFamily: "sans-serif" }}>
                                                            {
                                                                messages?.map((m, i) => {

                                                                    if (m.message != 'restart') {
                                                                        return (

                                                                            <li class={(m.flex == 'C') ? "clearfix " : "clearfix odd"}>
                                                                                <div class="chat-avatar">
                                                                                    <img src="/images/chat.png" alt="chatIcon" />
                                                                                </div>
                                                                                <div class="conversation-text">
                                                                                    <div class="ctext-wrap card">
                                                                                        <p>
                                                                                            {m.message}
                                                                                        </p><br />
                                                                                        <small>{new Date(m.created_at).toLocaleString("en-GB")}</small>
                                                                                    </div>
                                                                                </div>
                                                                            </li>


                                                                        );
                                                                    }
                                                                })
                                                            }

                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="simplebar-track simplebar-horizontal" style={{ visibility: "hidden" }}>
                                                <div className="simplebar-scrollbar" style={{ width: "0px", display: "none" }}></div>
                                            </div>
                                            <div className="simplebar-track simplebar-vertical" style={{ visibility: "visible" }}>
                                                <div className="simplebar-scrollbar" style={{ height: "348px", transform: "translate3d(0px, 0px, 0px)", display: "block" }}></div>
                                            </div>
                                        </div>



                                        {
                                            expired == 0 ? (
                                                <div className="row m-3" style={{ marginTop: "2px", width: "90%" }}>
                                                    <div className="input-group">
                                                        <input type="hidden" name="support_id" value="1" />
                                                        <input type="text" name="message" id="message_typing" onKeyDown={e => e.key === 'Enter' ? sendMessage() : ''} chat-box="" className="form-control" placeholder="Type..." />
                                                        <div className="input-group-prepend">
                                                            <button type="button" id="submitMessage" onClick={e => sendMessage()} className="btn chat-send btn-block waves-effect waves-light" style={{ background: "#00a4f39e!important", color: "black" }}><i className="fas fa-sharp fa-light fa-paper-plane"></i></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                                : (
                                                    <div className="input-group">

                                                        <div className="text-center">
                                                            <button type="button" className="btn btn-info text-white" data-toggle="modal" data-target="#exampleModalTemplate" >Restart Chat <i className="fas fa-refresh"></i></button>
                                                        </div>
                                                    </div>
                                                )
                                        }



                                    </div>
                                </div>

                                <div className="card col-sm-3 card-body sidemsg" style={{ backgroundColor: "#00a4f39e!important", borderRadius: "3%" }}>

                                    {data?.slice(0).reverse().sort((a, b) => b.unread - a.unread).map((d, i) => {

                                        let cd = clients?.find(({ num }) => num == d.number);

                                        return <div className={"mb-3 card p-3 mt-3 cl_"+d.number}   style={ d.unread > 0 ?  {background:'#e9dada'} : {} } onClick={e => { getMessages(d.number); setSelectNumber(d.number); localStorage.setItem('number', d.number);  setTimeout(() => { scroller(); }, 200) ; document.querySelector('.cl_'+d.number).style.background = '#fff' ; document.querySelector('.cn_'+d.number).remove();  }}>
                                            {cd &&
                                                <h5 className="mt-0 mb-1" style={{ cursor: "pointer" }}><Link to={(cd.client == 1) ? `/admin/view-client/${cd.id}` : `/admin/view-lead/${cd.id}`}><i class="fas fa-user" ></i>{cd.name}</Link></h5>
                                            }
                                            <h6 className="mt-0 mb-1" style={{ cursor: "pointer" }}><i class="fas fa-phone" ></i>{d.number}
                                            {
                                                d.unread > 0 && <span className={'text-danger p-2 cn_'+d.number} >{`(${d.unread})`}</span>
                                            }
                                            </h6>
                                           
                                        </div>

                                    })}



                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <div className="modal fade" id="exampleModalTemplate" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content" style={{ width: '130%' }}>
                        <div className="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Template</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>

                        <div className="modal-body">

                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <select class="form-control" name="template" id="template">
                                            <option value="">-- select template --</option>
                                            <option value="leads"> leads </option>
                                        </select>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" onClick={e => restartChat()}>Send</button>
                            <button type="button" class="btn btn-secondary" id="cbtn" data-dismiss="modal">Close</button>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
}
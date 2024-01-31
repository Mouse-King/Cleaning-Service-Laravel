import React, { useState, useEffect } from 'react'
import Sidebar from '../../Layouts/Sidebar'
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useAlert } from 'react-alert';
import { Link } from "react-router-dom";
import moment from 'moment';
import { template } from 'lodash';

export default function Messenger() {

    const [data, setData] = useState(null);
    const [messages, setMessages] = useState(null);
    const [selectNumber, setSelectNumber] = useState(null);
    const [pageId, setPageId] = useState('');
    const alert = useAlert();
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };


    const getData = () => {

        axios
            .get(`/api/admin/messenger-participants`, { headers })
            .then((res) => {

                const r = res.data.data.data;
                setPageId(res.data.page_id);
                setData(r);
            });
    }

    const getMessages = (no) => {

        axios
            .get(`/api/admin/messenger-message/${no}`, { headers })
            .then((res) => {
                const c = res.data.chat.messages.data;;

                let cl = localStorage.getItem('chatLenM');
                if (cl > c.length) {
                    scroller();
                }

                localStorage.setItem('chatLenM', c.length);
                setMessages(c);
            });

    }

    const sendMessage = () => {
        let msg = document.getElementById('message_typing').value;
        let pid = localStorage.getItem("participant_id");
        if (msg == '') {
            alert.error('Please type message');
            return;
        }
        if ( pid == null || pid == undefined) {
            alert.error('Please select sender');
            return;
        }
        const send = {
            pid: pid,
            message: msg,
        };
        axios
            .post(`/api/admin/messenger-reply`, send, { headers })
            .then((res) => {
                document.getElementById('message_typing').value = '';
                getMessages( localStorage.getItem("t_id") );
                setTimeout(() => { scroller(); }, 200);
            });
    }

    const callApi = () => {

        const interval = setInterval(() => {

            //getMessages(localStorage.getItem('number'));

        }, 2000);
        return () => clearInterval(interval);
    }

    const scroller = () => {

        var objDiv = document.getElementById("ko");
        objDiv.scrollTop = objDiv.scrollHeight;
    }

    const search = (s) => {

        let users = document.querySelectorAll('.uname');

        users.forEach((u, i) => {
            if (u.innerText.toLowerCase().includes(s.toLowerCase())) {
                u.style.display = "unset";
            } else {
                u.style.display = "none"
            }

        });

    }


    useEffect(() => {

        getData();
        callApi();
        localStorage.removeItem("participant_id");

    }, []);



    return (
        <div id="container">
            <Sidebar />
            <div id="content">
                <div className="view-applicant">
                    <div className='row'>

                        <div className='col-sm-6'>
                            <h1 className="page-title">Messenger Chat</h1>
                        </div>
                        <div className='col-sm-6 text-right page-title'>

                            <input type="text" name="smsg" className='form-control' onChange={e => search(e.target.value)} placeholder='search name' style={{ float: 'right', width: '55%' }} />

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

                                                                    return (

                                                                        <li class={(m.from.id != pageId) ? "clearfix " : "clearfix odd"}>
                                                                            <div class="chat-avatar">
                                                                                <img src="/images/chat.png" alt="chatIcon" />
                                                                            </div>
                                                                            <div class="conversation-text">
                                                                                <div class="ctext-wrap card">
                                                                                    <p>
                                                                                        {m.message}
                                                                                    </p><br />
                                                                                    <small>{new Date(m.created_time).toLocaleString("en-GB")}</small>
                                                                                </div>
                                                                            </div>
                                                                        </li>


                                                                    );

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


                                        <div className="row m-3" style={{ marginTop: "2px", width: "90%" }}>
                                            <div className="input-group">
                                                <input type="hidden" name="support_id" value="1" />
                                                <input type="text" name="message" id="message_typing" onKeyDown={e => e.key === 'Enter' ? sendMessage() : ''} chat-box="" className="form-control" placeholder="Type..." />
                                                <div className="input-group-prepend">
                                                    <button type="button" id="submitMessage" onClick={e => sendMessage()} className="btn chat-send btn-block waves-effect waves-light" style={{ background: "#00a4f39e!important", color: "black" }}><i className="fas fa-sharp fa-light fa-paper-plane"></i></button>
                                                </div>
                                            </div>
                                        </div>



                                    </div>
                                </div>

                                <div className="card col-sm-3 card-body sidemsg" style={{ backgroundColor: "#00a4f39e!important", borderRadius: "3%" }}>

                                    {data?.map((d, i) => {

                                        console.log(d);
                                        return <div className="mb-3 card p-3 mt-3 uname" onClick={e => { getMessages(d.id); setSelectNumber(d.id); localStorage.setItem('t_id', d.id); localStorage.setItem("participant_id",d.participants.data[0].id); setTimeout(() => { scroller(); }, 200) }}>

                                            <h5 className="mt-0 mb-1" style={{ cursor: "pointer" }}><Link to="#"><i class="fas fa-user" ></i>{d.participants.data[0].name}</Link></h5>

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
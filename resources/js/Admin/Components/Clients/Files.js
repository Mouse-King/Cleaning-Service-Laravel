import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import Moment from 'moment';
import Swal from 'sweetalert2';

export default function files() {

    const [note, setNote] = useState("");
    const [file, setFile] = useState([]);
    const [AllFiles, setAllFiles] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [meeting, setMeeting] = useState([]);
    const param = useParams();
    const alert = useAlert();
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };

    const handleFileChange = (e) => {
        let type = e.target.files[0].type.split('/')[1];
        let allow = ['jpeg', 'png', 'jpg', 'mp4', 'webm'];
        if (allow.includes(type)) {
            setFile(e.target.files[0]);
        } else {
            setFile([]);
            window.alert("This file is not allowed");
            document.querySelector('input[type="file"]').value = "";
        }
    }

    const handleFile = (e) => {

        e.preventDefault();
        if (meeting.length == 0 || meeting == 0) { window.alert('Please select meeting'); return; }
        if (file.length == 0) { window.alert('Please add file'); return; }
        const type = document.querySelector('select[name="filetype"]').value;
        const fd = new FormData();
        fd.append('user_id', param.id);
        fd.append('note', note);
        fd.append('meeting', meeting);
        fd.append('file', file);
        fd.append('type', type);
        fd.append('role', 'client');

        const videoHeader = {
            Accept: "application/octet-stream, text/plain, */*",
            "Content-Type": "application/octet-stream",
            Authorization: `Bearer ` + localStorage.getItem("admin-token"),
        }
        axios
            .post(`/api/admin/add-file`, fd, { headers: (type == 'image') ? headers : videoHeader })
            .then((res) => {
                console.log(res)
                if (res.data.error) {
                    for (let e in res.data.error) {
                        window.alert(res.data.error[e]);
                    }

                } else {
                    document.querySelector('.closeb').click();
                    alert.success(res.data.message);
                    getFiles();
                    setNote("");
                    setFile([]);
                    document.querySelector('input[type="file"]').value = "";
                }
            })

    }

    const handleDelete = (e, id) => {
        e.preventDefault();
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Delete File",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .post(`/api/admin/delete-file/`, { id: id }, { headers })
                    .then((response) => {
                        Swal.fire(
                            "Deleted!",
                            "File has been deleted.",
                            "success"
                        );
                        setTimeout(() => {
                            getFiles();
                        }, 1000);
                    });
            }
        });
    };

    const getFiles = () => {
        axios
            .post(`/api/admin/get-files`, { id: parseInt(param.id) }, { headers })
            .then((res) => {
                setAllFiles(res.data.files);
            })
    }
    const getMeetings = () => {
        axios
            .post(`/api/admin/client-schedules`, { id: param.id }, { headers })
            .then((res) => {
                setSchedules(res.data.schedules);
            })
    }

    useEffect(() => {
        getFiles();
        getMeetings();
    }, [])
    return (

        <div className="tab-pane fade active show" id="customer-notes" role="tabpanel"
            aria-labelledby="customer-notes-tab">
            <div className="text-right pb-3">
                <button type="button" className="btn btn-pink" data-toggle="modal" data-target="#exampleModal">
                    Add File
                </button>
            </div>
            {AllFiles && AllFiles.map((f, i) => {
                
                return (

                    <div className="card card-widget widget-user-2" style={{ "box-shadow": "none" }}>
                        <div className="card-comments cardforResponsive"></div>
                        <div className="card-comment p-3" style={{ "background-color": "rgba(0,0,0,.05)", "border-radius": "5px" }}>
                            <div className="row">
                                <div className="col-sm-7 col-6">
                                    <span className="noteDate" style={{ "font-weight": "600" }}>
                                        {Moment(f.created_at).format('DD-MM-Y h:sa')} <br />
                                        <span className="badge badge-warning text-dark">
                                            <a  onClick={(e)=>{
                                                let show =document.querySelector('.showFile');
                                                let showvideo = document.querySelector('.showvideo');
                                                if(f.type == "image"){
                                                    show.setAttribute('src',f.path);
                                                    show.style.display = 'block'
                                                    showvideo.style.display='none'
                                                }
                                                else{
                                                    showvideo.setAttribute('src',f.path);
                                                    showvideo.style.display = 'block'
                                                    show.style.display='none'
                                                }
                                            
                                            }} 
                                            data-toggle="modal" 
                                            data-target="#exampleModalFile" 
                                            style={{cursor:'pointer'}}>{f.file}</a>
                                        </span>
                                    </span>
                                </div>
                                <div className="col-sm-5 col-6">
                                    <div className="float-right noteUser">
                                        <button class="ml-2 btn bg-red" onClick={(e) => handleDelete(e, f.id)}><i class="fa fa-trash"></i></button>
                                        &nbsp;
                                    </div>
                                </div>
                                <div className="col-sm-12">
                                    {
                                        (f.note) ? f.note : 'NA'
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}


            <div className="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Add File</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">

                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <label className="control-label">
                                            Meeting
                                        </label>
                                        <select name="meeting" onChange={(e) => setMeeting(e.target.value)} className="form-control">
                                            <option value={0}>select meeting</option>
                                            {schedules && schedules.map((m, i) => {
                                                return <option value={m.id}>
                                                    {Moment(m.start_date).format('DD/MM/Y') + " | " + m.start_time + " - " + m.end_time}
                                                </option>
                                            })}
                                        </select>

                                    </div>
                                </div>

                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <label className="control-label">
                                            Note
                                        </label>
                                        <textarea
                                            type="text"
                                            value={note}
                                            onChange={(e) =>
                                                setNote(e.target.value)
                                            }
                                            className="form-control"
                                            required
                                            placeholder="Enter Note"
                                        ></textarea>

                                    </div>
                                </div>
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <label className="control-label">
                                            Type
                                        </label>
                                        <select name="filetype" className="form-control">
                                            <option value="image">Image</option>
                                            <option value="video">Video</option>
                                        </select>

                                    </div>
                                </div>
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <label className="control-label">
                                            File
                                        </label>
                                        <input
                                            type="file"
                                            name="file"
                                            onChange={(e) => {
                                                handleFileChange(e)

                                            }
                                            }
                                            className="form-control"
                                            required
                                        />

                                    </div>
                                </div>

                            </div>


                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary closeb" data-dismiss="modal">Close</button>
                            <button type="button" onClick={handleFile} className="btn btn-primary">Save File</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="exampleModalFile" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content" style={{width:'130%'}}>
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">

                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <img src="" className="showFile form-control"/>
                                        <video className="form-control showvideo" controls>
                                        <source src="" type="video/mp4" />    
                                        </video>

                                    </div>
                                </div>

                            </div>


                        </div>
                       
                    </div>
                </div>
            </div>
        </div>



    )
}
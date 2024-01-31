import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import Moment from 'moment';
import Swal from 'sweetalert2';

export default function Comment() {

    const [comment,setComment] = useState("");
    const [role,setRole] = useState("");
    const [allClientComment,setAllClientComment] = useState([]);
    const [allWorkerComment,setAllWorkerComment] = useState([]);
    const param = useParams();
    const alert = useAlert();

    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };

   
    const handleSubmit = (e) =>{
       
      e.preventDefault();
      if(role == ''){ window.alert('Please Select Comment For.'); return;}
      if(comment == ''){ window.alert('Please Enter Comment'); return;}
      let data={
        'job_id':param.id,
        'comment':comment,
        'role':role,
        'name':localStorage.getItem("admin-name")
      }
      
      axios
      .post(`/api/admin/job-comments`,data,{headers})
      .then((res)=>{
        if(res.data.error){
            for( let e in res.data.error){
                window.alert(res.data.error[e]);
            }
            
        } else {
           document.querySelector('.closeb').click();
           alert.success(res.data.message);
           getComments();
           setComment("");
           setRole("");
        }
      })
      
    }

    const handleDelete = (e,id) => {
        e.preventDefault();
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Delete Comment",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`/api/admin/job-comments/${id}`,{ headers })
                    .then((response) => {
                        Swal.fire(
                            "Deleted!",
                            "Comment has been deleted.",
                            "success"
                        );
                        setTimeout(() => {
                            getComments();
                        }, 1000);
                    });
            }
        });
    };

    const getComments = () =>{
      axios
      .get(`/api/admin/job-comments?id=${param.id}`,{ headers })
      .then((res)=>{
        console.log(res.data);
        setAllClientComment(res.data.client_comments);
        setAllWorkerComment(res.data.worker_comments);
      })
    }

    useEffect(()=>{
        getComments();
    },[])
    
    return (

        <div className="tab-pane fade active show" id="customer-notes" role="tabpanel"
            aria-labelledby="customer-notes-tab">
            <div className="text-right pb-3">
                <button type="button" className="btn btn-pink" data-toggle="modal" data-target="#exampleModal">
                    Add Comment
                </button>
            </div>
            <ul className="nav nav-tabs" role="tablist">
            <li className="nav-item" role="presentation"><a id="worker-availability" className="nav-link active" data-toggle="tab" href="#tab-worker-availability" aria-selected="true" role="tab">Client Comment</a></li>
            <li className="nav-item" role="presentation"><a id="current-job" className="nav-link" data-toggle="tab" href="#tab-current-job" aria-selected="true" role="tab">Worker Comment</a></li>
            </ul>
             <div className='tab-content' style={{background: "#fff"}}>
              <div id="tab-worker-availability" className="tab-pane active show" role="tab-panel" aria-labelledby="current-job">
            {allClientComment && allClientComment.map((c,i)=>{
                return (

            <div className="card card-widget widget-user-2" style={{ "box-shadow": "none" }}>
                <div className="card-comments cardforResponsive"></div>
                <div className="card-comment p-3">
                    <div className="row">
                        <div className="col-sm-10 col-10">
                            <p className="noteby p-1" style={{
                                 "font-size": "16px",

                            }}>
                            {
                            c.name
                            } - 
                            <span className="noteDate" style={{ "font-weight": "600" }}>
                                 {""+Moment(c.created_at).format('DD-MM-Y h:sa')} <br />
                            </span>
                            </p>
                        </div>
                        <div className="col-sm-2 col-2">
                            <div className="float-right noteUser">
                            <button class="ml-2 btn bg-red" onClick={(e)=>handleDelete(e,c.id)}><i class="fa fa-trash"></i></button>
                                &nbsp;
                            </div>
                        </div>
                        <div className="col-sm-12">
                          {c.comment}
                        </div>
                    </div>
                </div>
            </div>
            )
        })}
        </div>
        <div id="tab-current-job" className="tab-pane" role="tab-panel" aria-labelledby="current-job">
              {allWorkerComment && allWorkerComment.map((w,i)=>{
                return (

            <div className="card card-widget widget-user-2" style={{ "box-shadow": "none" }}>
                <div className="card-comments cardforResponsive"></div>
                <div className="card-comment p-3">
                    <div className="row">
                        <div className="col-sm-10 col-10">
                            <p className="noteby p-1" style={{
                                 "font-size": "16px",

                            }}>
                            {
                            w.name
                            } - 
                            <span className="noteDate" style={{ "font-weight": "600" }}>
                                 {" "+Moment(w.created_at).format('DD-MM-Y h:sa')} <br />
                            </span>
                            </p>
                        </div>
                        <div className="col-sm-2 col-2">
                            <div className="float-right noteUser">
                            <button class="ml-2 btn bg-red" onClick={(e)=>handleDelete(e,w.id)}><i class="fa fa-trash"></i></button>
                                &nbsp;
                            </div>
                        </div>
                        <div className="col-sm-12">
                          {w.comment}
                        </div>
                    </div>
                </div>
            </div>
            )
        })}
        </div>
        </div>


            <div className="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Add Comment</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">


                            <div className="row">
                             <div className="col-sm-12">
                                    <div className="form-group">
                                        <label className="control-label">
                                            Comment For
                                        </label>
                                        <select value={role} onChange={(e) =>
                                                setRole(e.target.value)
                                            } className="form-control">
                                        <option value="">Please Choose Comment For</option>
                                        <option value="client">Client</option>
                                        <option value="worker">Worker</option>
                                        </select>

                                    </div>
                                </div>
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <label className="control-label">
                                            Comment
                                        </label>
                                        <textarea
                                            type="text"
                                            value={comment}
                                            onChange={(e) =>
                                                setComment(e.target.value)
                                            }
                                            className="form-control"
                                            required
                                            placeholder="Enter Comment"
                                        ></textarea>

                                    </div>
                                </div>
                                
                            </div>


                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary closeb" data-dismiss="modal">Close</button>
                            <button type="button"  onClick={handleSubmit} className="btn btn-primary">Save Comment</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>



    )
}
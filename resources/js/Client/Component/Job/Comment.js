import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import Moment from 'moment';
import Swal from 'sweetalert2';
import { useTranslation } from "react-i18next";

export default function Comment() {

    const [comment,setComment] = useState("");
    const [allComment,setAllComment] = useState([]);
    const param = useParams();
    const alert = useAlert();
    const {t} = useTranslation();

    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("client-token"),
    };

   
    const handleSubmit = (e) =>{
       
      e.preventDefault();
      if(comment == ''){ window.alert('Please Enter Comment'); return;}
      let data={
        'job_id':param.id,
        'comment':comment,
        'name':localStorage.getItem("client-name")
      }
      
      axios
      .post(`/api/client/job-comments`,data,{headers})
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
                    .delete(`/api/client/job-comments/${id}`,{ headers })
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
      .get(`/api/client/job-comments?id=${param.id}`,{ headers })
      .then((res)=>{
        setAllComment(res.data.comments);
      })
    }

    useEffect(()=>{
        getComments();
    },[])
    return (

        <div className="tab-pane fade active show" id="customer-notes" role="tabpanel"
            aria-labelledby="customer-notes-tab">
            <div className="text-right pb-3">
                <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModal">
                {t('client.jobs.view.add_cmt')}
                </button>
            </div>
            {allComment && allComment.map((c,i)=>{
                return (

            <div className="card card-widget widget-user-2" style={{ "box-shadow": "none" }}>
                <div className="card-comments cardforResponsive"></div>
                <div className="card-comment p-3" style={{ "background-color": "rgba(0,0,0,.05)", "border-radius": "5px" }}>
                    <div className="row">
                        <div className="col-sm-10 col-10">
                            <p className="noteby p-1" style={{
                                 "font-size": "16px",

                            }}>
                            {
                            c.name
                            } - 
                            <span className="noteDate" style={{ "font-weight": "600" }}>
                                 {" "+Moment(c.created_at).format('DD-MM-Y h:sa')} <br />
                            </span>
                            </p>
                        </div>
                        <div className="col-sm-2 col-2">
                            <div className="float-right noteUser">
                            {(c.name==localStorage.getItem("client-name"))
                            ?
                            <button class="ml-2 btn bg-red" onClick={(e)=>handleDelete(e,c.id)}><i class="fa fa-trash"></i></button>
                             :''}
                                &nbsp;
                            </div>
                        </div>
                        <div className="col-sm-12">
                            <p className="rtl-comment">{c.comment}</p>
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
                            <h5 className="modal-title" id="exampleModalLabel">{t('client.jobs.view.add_cmt_box')}</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">

                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <label className="control-label">
                                        {t('client.jobs.view.cmt')}
                                        </label>
                                        <textarea
                                            type="text"
                                            value={comment}
                                            onChange={(e) =>
                                                setComment(e.target.value)
                                            }
                                            className="form-control"
                                            required
                                            placeholder={t('client.jobs.view.enter_cmt')}
                                        ></textarea>

                                    </div>
                                </div>
                                
                            </div>


                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary closeb" data-dismiss="modal">{t('client.jobs.view.close')}</button>
                            <button type="button"  onClick={handleSubmit} className="btn btn-primary">{t('client.jobs.view.save_cmt')}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>



    )
}
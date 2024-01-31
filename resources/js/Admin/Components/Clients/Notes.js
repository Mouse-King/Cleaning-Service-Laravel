import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import Moment from 'moment';
import Swal from 'sweetalert2';

export default function notes() {

    const [note,setNote] = useState("");
    const [AllNotes,setAllNotes] = useState([]);
    const param = useParams();
    const alert = useAlert();
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };

   
    const handleNote = (e) =>{
    
      e.preventDefault();
      let imp = document.querySelector('input[name="important"]');
      const data ={
        'note':note,
        'user_id':param.id,
        'team_id':localStorage.getItem('admin-id'),
        'role':'client',
        'important':imp.checked
      }
      
      axios
      .post(`/api/admin/add-note`,data,{  headers  })
      .then((res)=>{
        if(res.data.errors){
            for( let e in res.data.errors){
                window.alert(res.data.errors[e]);
            }
            
        } else {
           document.querySelector('.closeb1').click();
           alert.success(res.data.message);
           getNotes();
           setNote("");
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
            confirmButtonText: "Yes, Delete Note",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .post(`/api/admin/delete-note/`,{id:id},{ headers })
                    .then((response) => {
                        Swal.fire(
                            "Deleted!",
                            "Note has been deleted.",
                            "success"
                        );
                        setTimeout(() => {
                            getNotes();
                        }, 1000);
                    });
            }
        });
    };

    const getNotes = () =>{
      axios
      .post(`/api/admin/get-notes`,{id:parseInt(param.id)},{ headers })
      .then((res)=>{
        setAllNotes(res.data.notes);
      })
    }
    useEffect(()=>{
        getNotes();
    },[])
    
    return (

        <div className="tab-pane fade active show" id="customer-notes" role="tabpanel"
            aria-labelledby="customer-notes-tab">
            <div className="text-right pb-3">
                <button type="button" className="btn btn-pink" data-toggle="modal" data-target="#exampleModalNote">
                    Add Note
                </button>
            </div>
            {AllNotes && AllNotes.map((n,i)=>{
                return (

            <div className="card card-widget widget-user-2" style={{ "box-shadow": "none" }}>
                <div className="card-comments cardforResponsive"></div>
                <div className="card-comment p-3" style={{ "background-color": "rgba(0,0,0,.05)", "border-radius": "5px" }}>
                    <div className="row">
                        
                        <div className="col-sm-10 col-10">
                            <p className="noteby p-1" style={{
                                 "textTransform": "uppercase",
                                 "fontSize": "16px",

                            }}>
                            {
                            (n.team) ? n.team.name : 'NA'
                            } - 
                            <span className="noteDate" style={{ "font-weight": "600" }}>
                                 {"  "+Moment(n.created_at).format('DD-MM-Y h:sa')} <br />
                            </span>
                            </p>
                            
                        </div>
                        <div className="col-sm-2 col-2">
                            <div className="float-right noteUser">
                            <button class="ml-2 btn bg-red" onClick={(e)=>handleDelete(e,n.id)}><i class="fa fa-trash"></i></button>
                                &nbsp;
                            </div>
                        </div>
                        <div className="col-sm-12">
                        {
                            (n.important == 1) &&  <span className="hpoint">&#9755;</span>
                        }
                       
                        {
                          (n.note) ? n.note : 'NA'
                        }
                        </div>
                    </div>
                </div>
            </div>
            )
        })}


            <div className="modal fade" id="exampleModalNote" tabindex="-1" role="dialog" aria-labelledby="exampleModalNote" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalNote">Add Note</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">

                            <div className="row">
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
                                    
                            </div>

                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <label className="control-label">
                                        Mark if Important
                                        </label>
                                       <input type='checkbox' name='important' style={{'height':'auto','margin-inline':'5px'}}/> 

                                    </div>
                                </div>
                                    
                            </div>


                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary closeb1" data-dismiss="modal">Close</button>
                            <button type="button"  onClick={handleNote} className="btn btn-primary">Save Note</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>



    )
}
import React, { useState, useEffect } from "react";
import Sidebar from '../../Layouts/Sidebar';
import { Link } from "react-router-dom";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function EditLanguage() {
    
    const param = useParams(); 
    const [languages,setLanguages] = useState([]);
    const [loading,setLoading] = useState("Loading..");
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };

    const getLanguage = () =>{
       axios
       .get(`/api/admin/languages/${param.id}`,{ headers })
       .then((res)=>{
          setLanguages(res.data)
       })
    }
    useEffect(()=>{
        getLanguage();
    },[]);
    console.log(languages);
    return (
        <div id="container">
            <Sidebar />
            <div id="content">
                <div className="titleBox customer-title">
                    <div className="row">
                        <div className="col-sm-6">
                            <h1 className="page-title">Language</h1>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">

                        <div className="boxPanel">
                            <div className="table-responsive">
                                <textarea id="translator">Lang here</textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
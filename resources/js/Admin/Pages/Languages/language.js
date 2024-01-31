import React, { useState, useEffect } from "react";
import Sidebar from '../../Layouts/Sidebar';
import { Link } from "react-router-dom";
import axios from "axios";

export default function languages() {

    const [languages,setLanguages] = useState([]);
    const [loading,setLoading] = useState("Loading..");
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };

    const getLanguage = () =>{
       axios
       .get(`/api/admin/languages`,{ headers })
       .then((res)=>{
          (res.data.languages.length > 0)
          ? setLanguages(res.data.languages)
          : setLoading("No language found");
       })
    }
    useEffect(()=>{
        getLanguage();
    },[]);
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
                                {languages.length > 0 ? (
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th scope="col" >ID</th>
                                                <th scope="col" >Language</th>
                                                <th scope="col">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {languages &&
                                                languages.map((lng, index) => (
                                                    <tr>
                                                        <td>{lng.id}</td>
                                                        <td>{lng.name}</td>

                                                        <td>
                                                            <div className="d-flex">
                                                                <Link to={`/admin/edit-language/${lng.id}`} className="btn bg-green"><i className="fa fa-edit"></i></Link>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="text-center mt-5">{loading}</p>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
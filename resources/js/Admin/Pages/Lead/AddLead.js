import React, { useState, useEffect } from "react";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../Layouts/Sidebar";
import axios from "axios";
import { MultiSelect } from "react-multi-select-component";
import Select from 'react-select';
import { create } from "lodash";
export default function AddLead() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const alert = useAlert();
    const navigate = useNavigate();
    const [errors, setErrors] = useState([]);

    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            name: name,
            email: email,
            phone: phone,
            lead_status: 'lead',
            meta:''
        };

        axios
            .post(`/api/admin/leads`, data, { headers })
            .then((response) => {
                if (response.data.errors) {
                    setErrors(response.data.errors);
                } else {
                    alert.success("Lead has been created successfully");
                    setTimeout(() => {
                        navigate("/admin/leads");
                    }, 1000);
                }
            });
    };

    return (
        <div id="container">
            <Sidebar />
            <div id="content">
                <div className="edit-customer">
                    <h1 className="page-title addEmployer">Add Client</h1>
                    <div className="card">
                        <div className="card-body">
                            <form>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="form-group">
                                            <label className="control-label">
                                                Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) =>
                                                    setName(e.target.value)
                                                }
                                                className="form-control"
                                                required
                                                placeholder="Enter Name"
                                            />
                                            {errors.name ? (
                                                <small className="text-danger mb-1">
                                                    {errors.name}
                                                </small>
                                            ) : (
                                                ""
                                            )}
                                        </div>
                                    </div>
                                    
                                   
                                    
                                    <div className="col-sm-12">
                                        <div className="form-group">
                                            <label className="control-label">
                                                Email *
                                            </label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) =>
                                                    setEmail(e.target.value)
                                                }
                                                className="form-control"
                                                required
                                                placeholder="Email"
                                            />
                                            {errors.email ? (
                                                <small className="text-danger mb-1">
                                                    {errors.email}
                                                </small>
                                            ) : (
                                                ""
                                            )}
                                        </div>
                                    </div>

                                    

                                    <div className="col-sm-12 phone">
                                        <div className="form-group">
                                            <label className="control-label">
                                                Phone
                                            </label>
                                            <input
                                                type="tel"
                                                value={phone}
                                                name={'phone'}
                                                onChange={(e) =>
                                                    setPhone(e.target.value)
                                                }
                                                className="form-control pphone"
                                                placeholder="Phone"
                                            />
                                            {errors.phone ? (
                                                <small className="text-danger mb-1">
                                                    {errors.phone}
                                                </small>
                                            ) : (
                                                ""
                                            )}
                                        </div>

                                    </div>
                                    
                                
                                



                        

                                
                                </div>
                                <div className="form-group text-center">
                                    <input type="submit" value="SAVE" onClick={handleSubmit} className="btn btn-pink saveBtn" />
                                </div>

                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

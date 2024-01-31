import React, { useState } from "react";
import Sidebar from "../../Layouts/Sidebar";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";

export default function AddService() {

    const [service, setService]  = useState([]);
    const [serviceHeb, setServiceHeb]  = useState([]);
    const [template,setTemplate] = useState([]);
    const [status, setStatus] = useState(0);
    const [errors, setErrors] = useState([]);
    const alert = useAlert();
    const navigate = useNavigate();

    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            name: service,
            heb_name:serviceHeb,
            template:template,
            status: status,
        };

        axios
            .post(`/api/admin/services`, data, { headers })
            .then((response) => {
                if (response.data.errors) {
                    setErrors(response.data.errors);
                } else {
                    alert.success("Service has been created successfully");
                    setTimeout(() => {
                        navigate("/admin/services");
                    }, 1000);
                }
            });
    };

    return (
        <div id="container">
            <Sidebar />
            <div id="content">
                <div className="edit-customer">
                    <h1 className="page-title addEmployer">Add Service</h1>
                    <div className="card">
                        <div className="card-body">
                            <form>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="form-group">
                                            <label className="control-label">
                                                Service- En*
                                            </label>
                                            <input
                                                type="text"
                                                value={service}
                                                onChange={(e) =>
                                                    setService(e.target.value)
                                                }
                                                className="form-control"
                                                required
                                                placeholder="Enter Service"
                                            />
                                            {errors.service ? (
                                                <small className="text-danger mb-1">
                                                    {errors.name}
                                                </small>
                                            ) : (
                                                ""
                                            )}
                                        </div>

                                        <div className="form-group">
                                            <label className="control-label">
                                                Service- Heb*
                                            </label>
                                            <input
                                                type="text"
                                                value={serviceHeb}
                                                onChange={(e) =>
                                                    setServiceHeb(e.target.value)
                                                }
                                                className="form-control"
                                                required
                                                placeholder="Enter service hebrew name"
                                            />
                                            {errors.service ? (
                                                <small className="text-danger mb-1">
                                                    {errors.heb_name}
                                                </small>
                                            ) : (
                                                ""
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-sm-12">
                                        <div className="form-group">
                                            <label className="control-label">Template</label>
                                            <select
                                                className="form-control"
                                                value={template}
                                                onChange={(e) => setTemplate(e.target.value)}
                                            >
                                                <option>Please select</option>
                                                <option value="regular">Regular Services( 2*, 3*, 4*, 5* )</option>
                                                <option value="office_cleaning">Office Cleaning</option>
                                                <option value="after_renovation">After Renovation</option>
                                                <option value="thorough_cleaning">Thorough Cleaning</option>
                                                <option value="window_cleaning">Window Cleaning</option>
                                                <option value="polish">Polish</option>
                                                <option value="others">Others</option>
                                                
                                            </select>
                                            {errors.template ? (
                                                <small className="text-danger mb-1">
                                                    {errors.template}
                                                </small>
                                            ) : (
                                                ""
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-sm-12">
                                        <div className="form-group">
                                            <label className="control-label">Status</label>
                                            <select
                                                className="form-control"
                                                value={status}
                                                onChange={(e) => setStatus(e.target.value)}
                                            >
                                                <option>Please select</option>
                                                <option value="1">Active</option>
                                                <option value="0">Inactive</option>
                                            </select>
                                            {errors.status ? (
                                                <small className="text-danger mb-1">
                                                    {errors.status}
                                                </small>
                                            ) : (
                                                ""
                                            )}
                                        </div>
                                    </div>

                                    <div className="form-group text-center col-sm-12">
                                        <input
                                            type="submit"
                                            value="SAVE"
                                            onClick={handleSubmit}
                                            className="btn btn-pink saveBtn"
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}
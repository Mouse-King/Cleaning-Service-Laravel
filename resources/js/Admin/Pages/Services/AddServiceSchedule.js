import React, { useState } from "react";
import Sidebar from "../../Layouts/Sidebar";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";
import { SelectPicker } from 'rsuite';

export default function AddServiceSchedule(){

   const [name,setName]     = useState([]);
   const [nameHeb,setNameHeb]     = useState([]);
   const [cycle,setCycle]   = useState([]);
   const [period,setPeriod] = useState([]);
   const [status,setStatus] = useState(0);
   const [errors,setErrors] = useState([]);
   const pe = [
    { value: 'na', label: 'Not Required' },
    { value: 'D', label: 'Day' },
    { value: 'w', label: 'Week' },
    { value: '2w', label: '2 Weeks' },
    { value: '3w', label: '3 Weeks' },
    { value: '4w', label: '4 Weeks' },
    { value: '5w', label: '5 Weeks' },
    { value: 'm', label: 'Month' },
    { value: '2m', label: '2 Months' },
    { value: '3m', label: '3 Months' },
    { value: '6m', label: '6 Months' },
    { value: 'y', label: 'Year' },

]
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
          name: name,
          name_heb:nameHeb,
          cycle: cycle,
          period: period,
          status: status,
      };
     
      axios
          .post(`/api/admin/service-schedule`, data, { headers })
          .then((response) => {
              if (response.data.errors) {
                  setErrors(response.data.errors);
              } else {
                  alert.success("Schedule has been created successfully");
                  setTimeout(() => {
                      navigate("/admin/service-schedule");
                  }, 1000);
              }
          });
  };

   return (
      <div id="container">
            <Sidebar />
            <div id="content">
                <div className="edit-customer">
                    <h1 className="page-title addEmployer">Add schedule</h1>
                    <div className="card card-body">
                    <form>
                        <div className="row">
                            <div className="col-sm-12">
                                <div className="form-group">
                                    <label className="control-label">
                                        schedule - En *
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        className="form-control"
                                        required
                                        placeholder="Enter schedule"
                                    />
                                    {errors.schedule ? (
                                        <small className="text-danger mb-1">
                                            {errors.name}
                                        </small>
                                    ) : (
                                        ""
                                    )}
                                </div>

                                <div className="form-group">
                                    <label className="control-label">
                                        schedule - Heb*
                                    </label>
                                    <input
                                        type="text"
                                        value={nameHeb}
                                        onChange={(e) =>
                                            setNameHeb(e.target.value)
                                        }
                                        className="form-control"
                                        required
                                        placeholder="Enter schedule hebrew name"
                                    />
                                    {errors.schedule ? (
                                        <small className="text-danger mb-1">
                                            {errors.name_heb}
                                        </small>
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </div>

                            <div className="col-sm-12">
                                    <div className="form-group">
                                        <label className="control-label">
                                            Cycle *
                                        </label>
                                        <input
                                            type="number"
                                            value={cycle}
                                            onChange={(e) =>
                                                setCycle(e.target.value)
                                            }
                                            className="form-control"
                                            placeholder="Enter cycle count"
                                            required
                                        />
                                        {errors.cycle ? (
                                            <small className="text-danger mb-1">
                                                {errors.cycle}
                                            </small>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                </div>

                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <label className="control-label">Period</label>

                                        <SelectPicker
                                            data={pe}
                                            defaultValue={period}
                                            value={period}
                                            onChange={(value, event) => setPeriod(value)}
                                            size="lg"
                                            required
                                        />

                                        {errors.period ? (
                                            <small className="text-danger mb-1">
                                                {errors.period}
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

   );
}
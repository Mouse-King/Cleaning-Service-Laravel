import React, { useState } from "react";

export default function TaskFilter({ getFilteredTask }) {
    const [task, setTask] = useState("");   

    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };
    const handleFilter = () => {
        axios
            .get(
                "/api/admin/tasks?task=" +
                task,
                { headers }
            )
            .then((response) => {
                getFilteredTask(response);
            });
    };

    const handleReset = () => {
        setTask("");        
        axios.get("/api/admin/tasks", { headers }).then((response) => {
            getFilteredTask(response);
        });
    };
    return (
        <div className="row colFive">
            <div className="col-sm-9">
                <div className="form-group">                    
                    <input
                        type="text"
                        className="form-control"
                        name="task"
                        placeholder="Search Task"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                    />
                </div>
            </div>           
 
            <div className="col-sm-3">
                <div className="form-group">                   
                    <div className="d-flex">
                        <button
                            className="btn btn-success filterBtn"
                            onClick={handleFilter}
                        >
                            <i className="fa fa-search"></i>
                        </button>
                        <button
                            className="ml-2 btn btn-danger filterBtn"
                            onClick={handleReset}
                        >
                            <i className="fa fa-undo"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

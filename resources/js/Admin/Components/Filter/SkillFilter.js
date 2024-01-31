import React, { useState } from "react";

export default function SkillFilter({ getFilteredSkill }) {
    const [skill, setSkill] = useState("");   

    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };
    const handleFilter = () => {
        axios
            .get(
                "/api/admin/skills?skill=" +
                skill,
                { headers }
            )
            .then((response) => {
                getFilteredSkill(response);
            });
    };

    const handleReset = () => {
        setSkill("");        
        axios.get("/api/admin/skills", { headers }).then((response) => {
            getFilteredSkill(response);
        });
    };
    return (
        <div className="row colFive">
            <div className="col-sm-9">
                <div className="form-group">                    
                    <input
                        type="text"
                        className="form-control"
                        name="skill"
                        placeholder="Search Skill"
                        value={skill}
                        onChange={(e) => setSkill(e.target.value)}
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

import React, { useState } from "react";

export default function NationalityFilter({ getFilteredNationality }) {
    const [nationality, setNationality] = useState("");   

    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };
    const handleFilter = () => {
        axios
            .get(
                "/api/admin/nationalities?nationality=" +
                nationality,
                { headers }
            )
            .then((response) => {
                getFilteredNationality(response);
            });
    };

    const handleReset = () => {
        setNationality("");        
        axios.get("/api/admin/nationalities", { headers }).then((response) => {
            getFilteredNationality(response);
        });
    };
    return (
        <div className="row colFive">
            <div className="col-sm-9">
                <div className="form-group">                    
                    <input
                        type="text"
                        className="form-control"
                        name="nationality"
                        placeholder="Search Nationality"
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
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

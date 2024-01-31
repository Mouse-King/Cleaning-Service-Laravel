import React, { useState } from "react";

export default function LanguageFilter({ getFilteredLanguage }) {
    const [language, setLanguage] = useState("");   

    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };
    const handleFilter = () => {
        axios
            .get(
                "/api/admin/languages?language=" +
                language,
                { headers }
            )
            .then((response) => {
                getFilteredLanguage(response);
            });
    };

    const handleReset = () => {
        setLanguage("");        
        axios.get("/api/admin/languages", { headers }).then((response) => {
            getFilteredLanguage(response);
        });
    };
    return (
        <div className="row colFive">
            <div className="col-sm-9">
                <div className="form-group">                    
                    <input
                        type="text"
                        className="form-control"
                        name="language"
                        placeholder="Search Language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
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

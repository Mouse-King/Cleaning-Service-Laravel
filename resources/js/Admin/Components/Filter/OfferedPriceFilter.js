import axios from "axios";
import React, { useState, useEffect } from "react";
import { SelectPicker } from "rsuite";

export default function OfferedPriceFilter( {getFilteredOffers} ) {

    const [clients, setClients] = useState([]);
    const [client, setClient]  =  useState([]);
    const [phone, setPhone] = useState("");
    const [status, setStatus] = useState("");
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };
    const handleFilter = () => {
        axios
            .get(
                "/api/admin/offers?client_id=" +
                client+"&&phone="+phone+"&&status="+status,
                { headers }
            )
            .then((response) => {
                getFilteredOffers(response);
            });
    };
    const handleReset = () => {
        setOffers("");
        axios.get("/api/admin/offers", { headers }).then((response) => {
            getFilteredOffers(response);
        });
    };

    const getClients = () => {
        axios
            .get('/api/admin/all-clients', { headers })
            .then((res) => {
                setClients(res.data.clients);
            });
    };
    useEffect(() => {
        getClients();
    }, []);

    const cData = clients.map((c,i)=>{
      return { value:c.id, label:c.firstname+" "+c.lastname};
    }); 

    return (
        <div className="row colFive">

            <div className="col-sm-4">
                <div className="form-group">
                    <label className="control-label">Client Name</label>
                    <SelectPicker data={cData} value={client} onChange={(value,event)=>setClient(value)}/>
                </div>
            </div>

            <div className="col-sm-3">
                <div className="form-group">
                    <label className="control-label">Phone</label>
                    <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        placeholder="Phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
            </div>

            <div className="col-sm-3">
                <div className="form-group">
                    <label className="control-label">Status</label>
                    <select
                        className="form-control"
                        name="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option>Please Select</option>
                        <option value="sent">Sent</option>
                        <option value="accepted">Accepted</option>
                        <option value="declined">Declined</option>
                    </select>
                </div>
            </div>

            <div className="col-sm-2">
                <div className="form-group">
                    <label className="control-label">&nbsp;</label>
                    <div className="d-flex">
                        <button
                            className="btn bg-purple filterBtn"
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
    )
}

import React, { useState } from "react";

export default function UserFilter({ getFilteredEmployers }) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState("");

    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };
    const handleFilter = () => {
        axios
            .get(
                "/api/admin/employers?name=" +
                    name +
                    "&phone=" +
                    phone +
                    "&email=" +
                    email +
                    "&status=" +
                    status,
                { headers }
            )
            .then((response) => {
                getFilteredEmployers(response);
            });
    };

    const handleReset = () => {
        setName("");
        setPhone("");
        setEmail("");
        setStatus("");
        axios.get("/api/admin/employers", { headers }).then((response) => {
            getFilteredEmployers(response);
        });
    };
    return (
        <div className="row colFive">
            <div className="col-sm-3">
                <div className="form-group">
                    <label className="control-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
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
                    <label className="control-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                        <option value="0">Enable</option>
                        <option value="1">Disable</option>
                    </select>
                </div>
            </div>
            <div className="col-sm-3">
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
    );
}

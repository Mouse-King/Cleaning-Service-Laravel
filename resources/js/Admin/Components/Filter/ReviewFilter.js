import React, { useState } from "react";

export default function ReviewFilter({ getFilteredReviews }) {
    const [author, setAuthor] = useState("");
    const [rating, setRating] = useState("");
    const [date, setDate] = useState("");
    const [status, setStatus] = useState("");

    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };
    const handleFilter = () => {
        axios
            .get(
                "/api/admin/reviews?author=" +
                    author +
                    "&rating=" +
                    rating +
                    "&date=" +
                    date +
                    "&status=" +
                    status,
                { headers }
            )
            .then((response) => {
                getFilteredReviews(response);
            });
    };

    const handleReset = () => {
        setAuthor("");
        setRating("");
        setDate("");
        setStatus("");
        axios.get("/api/admin/reviews", { headers }).then((response) => {
            getFilteredReviews(response);
        });
    };
    return (
        <div className="row colFive">
            <div className="col-sm-3">
                <div className="form-group">
                    <label className="control-label">Author</label>
                    <input
                        type="text"
                        className="form-control"
                        name="author"
                        placeholder="Author"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                    />
                </div>
            </div>
            <div className="col-sm-3">
                <div className="form-group">
                    <label className="control-label">Rating</label>
                    <select
                        className="form-control"
                        name="rating"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                    >
                        <option>Please Select</option>
                        <option value="1">1 Star</option>
                        <option value="2">2 Star</option>
                        <option value="3">3 Star</option>
                        <option value="4">4 Star</option>
                        <option value="5">5 Star</option>
                    </select>
                </div>
            </div>
            <div className="col-sm-3">
                <div className="form-group">
                    <label className="control-label">Date</label>
                    <input
                        type="date"
                        className="form-control"
                        name="date"
                        placeholder="Date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
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

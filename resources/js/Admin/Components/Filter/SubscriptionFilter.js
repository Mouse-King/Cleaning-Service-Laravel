
import React, { useEffect, useState } from 'react'

export default function SubscriptionFilter({getFilteredSubscriptions}) {
    const [date, setDate] = useState('');
    const [employer, setEmployer] = useState('');
    const [plan, setPlan] = useState('');
    const [plans, setPlans] = useState([]);

    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };

    const getPlans = () => {
        axios.get("/api/admin/subscriptions/create", { headers }).then((response) => {

            if (response.data.plans.length > 0) {
                setPlans(response.data.plans);               
            } else {
                setPlans([]);
            }

        });
    };
    useEffect(() => {
        getPlans();
    }, []);

    const handleFilter = () => {
        axios
            .get(
                "/api/admin/subscriptions?date=" +
                    date +
                    "&employer=" +
                    employer +
                    "&plan=" +
                    plan,
                { headers }
            )
            .then((response) => {
                getFilteredSubscriptions(response);
            });
    };

    const handleReset = () => {
        setDate("");
        setEmployer("");
        setPlan("");
        axios.get("/api/admin/subscriptions", { headers }).then((response) => {
            getFilteredSubscriptions(response);
        });
    };
  return (
    <>
        <div className="row">
            <div className="col-sm-3">
                <div className="form-group">
                    <label className="control-label">Date</label>
                    <input type='date' className="form-control" name="date" placeholder="Date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
            </div>
            <div className="col-sm-3">
                <div className="form-group">
                    <label className="control-label">Employer Name</label>
                    <input type='text' className="form-control" name="employer" placeholder="Employer Name" value={employer} onChange={(e) => setEmployer(e.target.value)}/>
                </div>
            </div>
            <div className="col-sm-3">
                <div className="form-group">
                    <label className="control-label">Plan</label>
                    <select className='form-control' name='plan' value={plan} onChange={(e) => setPlan(e.target.value)}>
                        <option value="">Please Select</option>
                        {
                            plans && plans.map((item, index) => (
                              <option value={item.id} key={index}>{item.name}</option>  
                            ))
                        }                        
                    </select>
                </div>
            </div>
            <div className="col-sm-3">
                <div className="d-flex mt-4">
                <button className="btn btn-danger filterBtn" onClick={handleFilter}>
                    <i className="fas fa-search"></i>
                </button>
                <button className="btn btn-dark ml-1 filterBtn" onClick={handleReset}>
                    <i className="fas fa-undo"></i>
                </button>
                </div>
            </div>
        </div>
    </>
  )
}


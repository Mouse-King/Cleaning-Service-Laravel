import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useParams,useNavigate } from "react-router-dom";
import Sidebar from "../../Layouts/Sidebar";

export default function EditWorker() {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [errors, setErrors] = useState([]);
  const params = useParams();
  const navigate = useNavigate();
  const alert = useAlert();
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        
        const data = {
        "firstname": firstname,
        "lastname":  lastname,
        "phone": phone,
        "email":email,
        "lead_status": 'lead',
        "meta":''
    }
   

        axios
            .put(`/api/admin/leads/${params.id}`, data ,{ headers })
            .then((response) => {
                if (response.data.errors) {
                    setErrors(response.data.errors);
                } else {
                    alert.success("Lead has been updated successfully");
                    setTimeout(() => {
                        navigate("/admin/leads");
                    }, 1000);
                }
            });
    };


    const getLead = () => {
        axios
            .get(`/api/admin/leads/${params.id}/edit`, { headers })
            .then((response) => {
                setFirstName(response.data.lead.firstname);
                setLastName(response.data.lead.lastname);
                setEmail(response.data.lead.email);
                setPhone(response.data.lead.phone);               
            });
    };
    
    useEffect(() => {
        getLead();
        
    }, []);
    return (
        <div id="container">
            <Sidebar />
            <div id="content">
                <div className="edit-customer">
                    <h1 className="page-title editEmployer">Edit Lead</h1>
                    <div className="dashBox p-4">
                        <form>
                            <div className='row'>
                                <div className='col-sm-12'>
                                    <div className='form-group'>
                                        <label className='control-label'>First Name *</label>
                                        <input type='text' value={firstname} onChange={(e) => setFirstName(e.target.value)} className='form-control' required placeholder='Enter FirstName' />
                                        {errors.name ? (
                                            <small className="text-danger mb-1">
                                                {errors.firstname}
                                            </small>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                </div>
                                <div className='col-sm-12'>
                                    <div className='form-group'>
                                        <label className='control-label'>Last Name *</label>
                                        <input type='text' value={lastname} onChange={(e) => setLastName(e.target.value)} className='form-control' required placeholder='Enter LastName' />
                                        {errors.name ? (
                                            <small className="text-danger mb-1">
                                                {errors.lastname}
                                            </small>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                </div>
                                 <div className='col-sm-12'>
                                    <div className='form-group'>
                                        <label className='control-label'>Email</label>
                                        <input type='tyoe' value={email} onChange={(e) => setEmail(e.target.value)} className='form-control' placeholder='Enter Email' />
                                        {errors.email ? (
                                            <small className="text-danger mb-1">
                                                {errors.email}
                                            </small>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                </div>
                                <div className='col-sm-12'>
                                    <div className='form-group'>
                                        <label className='control-label'>Phone</label>
                                        <input type='tel' value={phone} onChange={(e) => setPhone(e.target.value)} className='form-control' placeholder='Enter Phone' />
                                        {errors.phone ? (
                                            <small className="text-danger mb-1">
                                                {errors.phone}
                                            </small>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="form-group text-center">
                                <input type='submit' value='Update'  onClick={handleUpdate} className="btn btn-danger saveBtn"/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

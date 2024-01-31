import React, { useState, useEffect } from 'react'
import Sidebar from '../../Layouts/Sidebar'
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useAlert } from 'react-alert';
import { Link } from "react-router-dom";

export default function responses() {

    const [responses, setResponses] = useState(null);

    const [formValues, setFormValues] = useState([{
        heb: "",
        eng: "",
        status: "",
    }])

    const alert = useAlert();
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };


    const getResponses = () => {

        axios
            .get(`/api/admin/chat-responses`, { headers })
            .then((res) => {
                const r = res.data.responses;
                setFormValues(r);
            });
    }

    let addFormFields = () => {
        setFormValues([...formValues, {
            keyword: "",
            heb: "",
            eng: "",
            status: "",
        }])
    }

    let removeFormFields = (i) => {
        let newFormValues = [...formValues];
        newFormValues.splice(i, 1);
        setFormValues(newFormValues)
    }

    let handleChange = (i, e) => {

        let newFormValues = [...formValues];
        newFormValues[i][e.target.name] = e.target.value;

        setFormValues(newFormValues);
    }

    let handleSubmit = (event) => {
        event.preventDefault();

        for (let t in formValues) {


            if (formValues[t].status == '') {
                formValues[t].status = '1';
            }

            if(formValues[t].keyword == ''){
                alert.error('One of the keyword is missing');
                return;
            }
            if(formValues[t].heb == ''){
                alert.error('One of the hebrew text is missing');
                return;
            }
            if(formValues[t].en == ''){
                alert.error('One of the english text is missing');
                return;
            }
        }


        event.target.setAttribute('disabled', true);
        event.target.value =  'Saving..';

        axios
            .post(`/api/admin/save-response`, {data:formValues}, { headers })
            .then((response) => {
                if (response.data.errors) {
                    for (let e in response.data.errors) {
                        alert.error(response.data.errors[e]);
                    }
                    document.querySelector('.saveBtn').removeAttribute('disabled');
                    document.querySelector('.saveBtn').value = 'Save';
                } else {
                    alert.success(response.data.message);
                    setTimeout(() => {
                       window.location.reload(1);
                    }, 1000);
                }
            });


    }

    useEffect(() => {
        getResponses();
    }, []);


    return (
        <div id="container">
            <Sidebar />
            <div id="content">
                <div className="view-applicant">
                    <h1 className="page-title editJob">Whatsapp Responses</h1>
                    <div className='card'>
                        <div className="card-dark">
                            <div className="card-header card-black">
                                <h3 class="card-title">Responses</h3>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table class="table-sm">
                                        <thead>
                                            <tr>
                                                <th style={{ width: "10%" }}>Keyword</th>
                                                <th style={{ width: "40%" }}>Hebrew Text</th>
                                                <th style={{ width: "40%" }}>English Text</th>
                                                <th style={{ width: "10%" }}>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {formValues.map((element, index) => (
                                                <tr key={index}>


                                                    <td>
                                                        <input type="text" name="keyword" onChange={e => handleChange(index, e)} className="form-control" value={element.keyword || ""} style={{lineHeight:"3"}} required placeholder="Enter keyword" />
                                                    </td>
                                                    <td>
                                                        <textarea name="heb" value={element.heb || ""} onChange={e => handleChange(index, e)} className="form-control" required placeholder="Enter hebrew Text"></textarea>
                                                    </td>
                                                    <td>
                                                        <textarea name="eng" value={element.eng || ""} onChange={e => handleChange(index, e)} className="form-control" required placeholder="Enter English Text"></textarea>
                                                    </td>

                                                    <td>
                                                        <select name="status" className="form-control" value={element.status || ""} onChange={(e) => { handleChange(index, e); }} style={{height:"60px"}}  >
                                                            <option selected value="1">Enable</option>
                                                            <option value="0">Disable</option>
                                                        </select>
                                                    </td>

                                                    <td class="text-right"><button className="ml-2 btn bg-red" onClick={() => removeFormFields(index)}><i className="fa fa-minus"></i></button></td>
                                                </tr>
                                            ))}


                                        </tbody>

                                        <tfoot>
                                            <tr>
                                                <td class="text-right" colSpan="6">
                                                    <button type="button" class="btn bg-green" onClick={() => addFormFields()}><i class="fa fa-plus"></i></button>
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                                <div className="text-center">
                                    <input type="submit" value="Save" className="btn btn-success saveBtn" onClick={handleSubmit} style={{ 'margin-inline': '6px' }} />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}
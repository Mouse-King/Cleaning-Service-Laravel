import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAlert } from "react-alert";
import { Base64 } from "js-base64";

export default function Documents() {
    const params = useParams();
    const id = (params.id);
    const [form, setForm] = useState(false);
    const getForm = () => {
        axios
            .get(`/api/get101/${id}`)
            .then((res) => {

                if (res.data.form.length > 0) {
                    if (res.data.form[0].form_101 != null) {
                        setForm(true);
                    }

                } else {
                    setForm(false);
                }
            })

    }
    useEffect(() => {
        getForm();
    }, []);

    return (
        <div className="tab-pane fade active show" id="customer-notes" role="tabpanel"
            aria-labelledby="customer-notes-tab">

            <div className='container1'>
                {
                    (form == true) ?
                        <>
                            <span class="btn btn-success">Signed</span>
                            <p><Link
                            target="_blank"
                                to={`/form101/` + Base64.encode(id.toString())}
                                className="m-2"
                            >View Form</Link></p>
                        </>
                        :
                        <> <span class="btn btn-warning">Not Signed</span> </>
                }
            </div>
        </div>
    );
}
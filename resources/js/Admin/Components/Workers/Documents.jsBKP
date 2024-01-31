import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import { Base64 } from "js-base64";
import logo from "../../../Assets/image/logo.png";
import check from "../../../Assets/image/icons/check-mark.png";
import SignatureCanvas from 'react-signature-canvas'

export default function Documents() {

    const [file, setFile] = useState(false);
    const [pdf, setPdf] = useState('');
    const params = useParams();
    const alert = useAlert();
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };


    const handlePdfUpload = (e) => {
        setPdf(e.target.files[0]);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('pdf', pdf);
        axios.post(`/api/admin/upload/${params.id}`, formData, { headers })
            .then((response) => {
                document.querySelector('.closedoc').click();
                alert.success('Form Upload Successfully');
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const getWorker = () => {
        const headers = {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ` + localStorage.getItem("admin-token"),
        };
        axios
            .get(`/api/admin/workers/${params.id}/edit`, { headers })
            .then((response) => {
                setFile(response.data.worker.form_101);
            });
    };
    useEffect(() => {
        getWorker();
    }, []);

    const [selected, setSelected] = useState("");
    const param = useParams();
    const id = param.id;
    const [file2, setFile2] = useState();
    const [form, setForm] = useState([]);
    const sigRef = useRef();
    const [signature, setSignature] = useState(null);
    const handleSignatureEnd = () => {
        setSignature(sigRef.current.toDataURL());
    }
    const clearSignature = () => {
        sigRef.current.clear();
        setSignature(null);
    }

    const handleSubmit = (e) => {

        let country = document.querySelector('select[name="p-country"]');
        let pset = document.querySelector('select[name="p-settlement"]');
        if (e.target.name == 'income') {
            const ik = {};
            let incm = document.querySelectorAll('input[name="income"]:checked');
            incm.forEach((e, i) => {
                (i == 0) ?
                    ik['income'] = e.value + " | "
                    : ik['income'] += e.value + " | "

            })
            data['income'] = ik;

        } else {
            data[e.target.name] = e.target.value;
            if (country != null)
                data['country'] = country.options[country.selectedIndex].value;
            if (pset != null)
                data['p-settlement'] = pset.options[pset.selectedIndex].value;
            data['bid-sex'] = document.querySelector('input[name="bid-sex"]:checked').value;
            data['p-sex'] = document.querySelector('input[name="p-sex"]:checked').value;

        }

    }
    const finalSubmit = () => {

        const Data = {
            ...data,
            "photocopy_id_appendix": (file != undefined) ? file : '',
            "p-file": (file2 != undefined) ? file2 : '',
            "signature": signature
        }

        let success = true;

        if (!Data.name) { alert.error('Please enter name'); success = false; return false; }
        if (!Data.phone_number) { alert.error('Please enter phone number'); success = false; return false; }
        if (!Data.first_name) { alert.error('Please enter first name'); success = false; return false; }
        if (!Data.last_name) { alert.error('Please enter lastname'); success = false; return false; }

        if (!Data.identification) { alert.error('Please choose identification'); success = false; return false; }
        else if (Data.identification == 'byId') {
            let bid = document.querySelectorAll('.bid');
            let bidr = document.querySelectorAll('.bidr');
            bid.forEach((e, i) => {
                if (e.value == '') {
                    let name = e.name.split('-')[1];
                    if (name != undefined) {
                        name = name.replace('_', ' ');
                        alert.error('Please enter ' + name);
                        success = false;
                        return false;
                    }
                }
            })
            /* 
             COMMENTED RADIO BUTTONS NOT MANDATORY
       
            bidr.forEach((e,i)=>{
               console.log(e.checked)
               if(e.checked == false){
                 let name= e.name.split('-')[1];
                 if(name != undefined){
                 name = name.replace('_',' '); 
                 alert.error('Please choose '+name);
                 success = false;
                 return false;
               }
             }
             })*/

        } else {

            let pid = document.querySelectorAll('.pid');
            let pidr = document.querySelectorAll('.pidr');
            pid.forEach((e, i) => {
                if (e.value == '') {
                    let name = e.name.split('-')[1];
                    if (name != undefined) {
                        name = name.replace('_', ' ');
                        alert.error('Please enter ' + name);
                        success = false;
                        return false;
                    }
                }
            })
            /* pidr.forEach((e,i)=>{
               if(!e.checked){
                 let name= e.name.split('-')[1];
                 if(name != undefined){
                 name = name.replace('_',' '); 
                 alert.error('Please choose '+name);
                 success = false;
                 return false;
               }
             }
             })*/


        }
        if (!Data.income) { alert.error('Please choose income details'); success = false; return false; }
        if (!Data.taxDate) { alert.error('Please enter date of commencement '); success = false; return false; }
        if (!Data.signature || Data.signature == null) { alert.error('Please sign form'); success = false; return false; }

        if (success == true) {
            axios
                .post(`/api/form101`, { id: id, data: Data })
                .then((res) => {
                    if (res.data.success_code == 200) {
                        alert.success('Successfuly signed');
                        setTimeout(() => {
                            window.location.reload(true);
                        }, 2000);
                    } else {
                        window.alert('something went wrong ! please try again')
                    }
                })
        }
    }

    const getForm = () => {
        axios
            .get(`/api/get101/${id}`)
            .then((res) => {
                if (res.data.form.length > 0) {
                    let fm = JSON.parse(res.data.form[0].form_101).data;

                    setForm(fm);
                    for (let f in fm) {
                        if (f != '' && f != null && f != undefined) {

                            let el = document.querySelector('input[name="' + f + '"]');
                            if (el != null && el.type != 'radio' && el.type != 'checkbox') {
                                el.value = fm[f];
                                el.setAttribute('readonly', true);
                            }

                        }

                    }

                } else {
                    setForm([])
                }
            })

    }
    setTimeout(() => {
        if (form.length != 0) {
            setSelected(form.identification.toString());
        }
    }, 1000)

    useEffect(() => {
        getForm();
        setTimeout(() => {
            var c = document.querySelectorAll("canvas");
            c.forEach((e, i) => {
                e.setAttribute('width', '300px');
                e.setAttribute('height', '115px');
            })

        }, 500);
    }, []);

    const handleFile = (data) => {
        const reader = new FileReader()
        reader.readAsDataURL(data)
        reader.onload = () => {
            setFile(reader.result);
        }
    }
    const handleFile2 = (data) => {
        const reader = new FileReader()
        reader.readAsDataURL(data)
        reader.onload = () => {
            setFile2(reader.result);
        }
    }

    return (

        <div className="tab-pane fade active show" id="customer-notes" role="tabpanel"
            aria-labelledby="customer-notes-tab">

            <div className='container1'>
                <div className='form101 p-4'>
                    {
                        (form && form.signature != null) ?
                            <span className='btn btn-success float-right m-3'>Signed</span>
                            : <span className='btn btn-warning float-right m-3'>Not Signed</span>
                    }

                    <img src={logo} className='img-fluid broom-logo' alt='Broom Services' />
                    <h1 className='text-center'>Form 101</h1>
                    <p className='text-center max600'>Employee card - and a request for tax relief and coordination by the employer according to the Income Tax Regulations (deduction from salary and wages), 1993</p>
                    <p className='text-center max600'>This form will be filled out by each employee upon starting his job, as well as at the beginning of each tax year (unless the manager has approved otherwise). The form is a reference for the employer to provide tax relief and to make tax adjustments in the calculation of the employee's salary. If there is a change in the details - this must be declared within a week.</p>
                    <hr />
                    <div className='agg-list'>
                        <div className='icons'><img src={check} /></div>
                        <div className='agg-text'>
                            <p>Fill out the form and at the bottom of the page you can Download a PDF file with the details you filled out. The file you will receive is a normal and standard Form 101.</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={check} /></div>
                        <div className='agg-text'>
                            <p>Send the form by email to you and the employer.</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={check} /></div>
                        <div className='agg-text'>
                            <p>Save a draft of the form and continue later.</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={check} /></div>
                        <div className='agg-text'>
                            <p>The form is a free service operated by the Broom Service and not operated by the Tax Authority and is not approved by it.</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={check} /></div>
                        <div className='agg-text'>
                            <p>Note! If your employer uses a different system for forms 101 - you must fill out the form there. It is recommended to check with the employer.</p>
                        </div>
                    </div>
                    <div className='agg-list'>
                        <div className='icons'><img src={check} /></div>
                        <div className='agg-text'>
                            <p>Your privacy is important to us. We do not use your information and do not transfer it to third parties.</p>
                        </div>
                    </div>
                    <div className='box-heading'>
                        <h2>Tax year</h2>
                        <p><strong>2023</strong> (The form can only be filled out for the current tax year. Except in the month of December, when the form can also be filled out for the next tax year and in the month of January, when the form can be filled out also for the previous tax year, for the benefit of employees who did not have time to fill out the form in time.)</p>
                    </div>
                    <div className='box-heading'>
                        <h2>A. Employer details</h2>
                        <div className='row'>
                            <div className='col-sm-3 col-xs-6'>
                                <div className='form-group'>
                                    <label className='control-label'>Name*</label>
                                    <input type='text' className='form-control man' name="name" placeholder='Name' required />
                                </div>
                            </div>
                            <div className='col-sm-3 col-xs-6'>
                                <div className='form-group'>
                                    <label className='control-label'>Address</label>
                                    <input type='text' className='form-control man' name="address" placeholder='Address' />
                                </div>
                            </div>
                            <div className='col-sm-3 col-xs-6'>
                                <div className='form-group'>
                                    <label className='control-label'>Phone Number*</label>
                                    <input type='tel' className='form-control man' placeholder='Phone Number' name="phone_number" required />
                                </div>
                            </div>
                            <div className='col-sm-3 col-xs-6'>
                                <div className='form-group'>
                                    <label className='control-label'>Deduction file ID</label>
                                    <input type='text' className='form-control man' name="deduction_fileId" placeholder='Deduction file ID' />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='box-heading'>
                        <h2>B. Employee details</h2>
                        <div className='row'>
                            <div className='col-sm-4 col-xs-6'>
                                <div className='form-group'>
                                    <label className='control-label d-block'>Identification by*</label>
                                    {
                                        (form.length != 0 && form['identification'] != null) ?
                                            <span className='text-success font-weight-bold'>
                                                {(form['identification'] == "byId" ? 'ID Proof' : 'Passport')}
                                            </span>
                                            :
                                            <>
                                                <input className='mr-1' type="radio" name="identification" value="byId" id="byId" checked={selected === "byId"} onChange={(e) => { setSelected(e.target.value); }} />
                                                <label className='mr-2' htmlFor="byId">ID</label>

                                                <input className='mr-1' type="radio" value="passport" id="passport" checked={selected === "passport"} name="identification" onChange={(e) => { setSelected(e.target.value); }} />
                                                <label className='mr-2' ohtmlFor="passport">Passport (for a foreign citizen)</label>
                                            </>
                                    }

                                </div>
                            </div>
                            <div className='col-sm-4 col-xs-6'>
                                <div className='form-group'>
                                    <label className='control-label'>First name*</label>
                                    <input type='text' name="first_name" className='form-control man' placeholder='First name' required />
                                </div>
                            </div>
                            <div className='col-sm-4 col-xs-6'>
                                <div className='form-group'>
                                    <label className='control-label'>Last name*</label>
                                    <input type='text' name="last_name" className='form-control man' placeholder='Last name' required />
                                </div>
                            </div>

                            <div className='col-sm-12'>
                                <div aria-hidden={selected !== "byId" ? true : false}>
                                    <div className='row'>
                                        <div className='col-sm-4 col-xs-6'>
                                            <div className='form-group'>
                                                <label className="control-label">ID Number*</label>
                                                <input type='text' name="bid-id_number" className="form-control bid" placeholder="" required />
                                            </div>
                                        </div>
                                        <div className='col-sm-4 col-xs-6'>
                                            <div className='form-group'>
                                                <label className="control-label">Photocopy of ID card and appendix</label>
                                                <input type="file" name="photocopy_id_appendix" className='bid' onChange={(e) => { handleFile(e.target.files[0]) }} style={{ display: "block" }} />
                                                <img src={(file)} className="img-fluid" style={{ maxWidth: "70px", marginTop: "10px" }} />
                                                {
                                                    form && form.signature != null && <button type="button" className="btn btn-pink m-2"
                                                        onClick={(e) => {
                                                            let sf = document.querySelector('.showfile');
                                                            sf.setAttribute('src', form['photocopy_id_appendix']);
                                                            sf.style.width = '100%';
                                                        }}
                                                        data-toggle="modal" data-target="#exampleModal">
                                                        view uploaded File
                                                    </button>
                                                }
                                            </div>
                                        </div>
                                        <div className='col-sm-4 col-xs-6'>
                                            <div className='form-group'>
                                                <label className="control-label">Date of Birth*</label>
                                                <input type='date' name="bid-dob" className="form-control bid" placeholder="" required />
                                            </div>
                                        </div>
                                        <div className='col-sm-4 col-xs-6'>
                                            <div className='form-group'>
                                                <label className="control-label">Date of immigration</label>
                                                <input type='date' name="bid-date_of_immigration" className="form-control bid" placeholder="" />
                                            </div>
                                        </div>
                                        <div className='col-sm-4 col-xs-6'>
                                            <div className='form-group'>
                                                <label className="control-label">Address</label>
                                                <input type='text' name="bid-address" className="form-control bid" placeholder="Address" />
                                            </div>
                                        </div>
                                        <div className='col-sm-4 col-xs-6'>
                                            <div className='form-group'>
                                                <label className="control-label">Mobile number*</label>
                                                <input type='tel' name="bid-mobile_number" className="form-control bid" placeholder="Mobile number" required />
                                            </div>
                                        </div>
                                        <div className='col-sm-4 col-xs-6'>
                                            <div className='form-group'>
                                                <label className="control-label">Phone number</label>
                                                <input type='tel' name="bid-phone_number" className="form-control bid" placeholder="Phone number" />
                                            </div>
                                        </div>
                                        <div className='col-sm-4 col-xs-6'>
                                            <div className='form-group'>
                                                <label className="control-label">Email*</label>
                                                <input type='email' name="bid-email" className="form-control bid" placeholder="Email" required />
                                            </div>
                                        </div>
                                        <div className='col-sm-4 col-xs-6'>
                                            <div className='form-group'>
                                                {
                                                    (form.length != 0 && form['bid-sex'] != null) ?
                                                        <span className='text-success font-weight-bold'>{form['bid-sex']}</span>
                                                        :
                                                        <>
                                                            <label className="control-label d-block">Sex*</label>
                                                            <input className='mr-1 bidr' name="bid-sex" type="radio" value="Male" id="Male" checked />
                                                            <label className='mr-2' htmlFor="Male">Male</label>
                                                            <input className='mr-1 bidr' name="bid-sex" type="radio" value="Female" id="Female" />
                                                            <label className='mr-2' ohtmlFor="Female">Female</label>
                                                        </>
                                                }

                                            </div>
                                        </div>
                                        <div className='col-sm-12'>
                                            <div className='row'>
                                                <div className='col-sm-3'>
                                                    <div className='form-group'>
                                                        <label className="control-label">Martial Status</label>
                                                        {
                                                            (form.length != 0 && form['bid-martial'] != null) ?
                                                                <>
                                                                    <div class="form-check">
                                                                        <span class="text-success font-weight-bold">{form['bid-martial']}</span>
                                                                    </div>
                                                                </>
                                                                :
                                                                <>
                                                                    <div class="form-check">
                                                                        <input class="form-check-input bidr" type="radio" name="bid-martial" id="mstatus" value="Single" />
                                                                        <label class="form-check-label" for="Single">Single</label>
                                                                    </div>
                                                                    <div class="form-check">
                                                                        <input class="form-check-input bidr" type="radio" name="bid-martial" id="mstatus" value="Married" />
                                                                        <label class="form-check-label" for="Married">Married</label>
                                                                    </div>
                                                                    <div class="form-check">
                                                                        <input class="form-check-input bidr" type="radio" name="bid-martial" id="mstatus" value="Divorcee" />
                                                                        <label class="form-check-label" for="Divorcee">Divorcee</label>
                                                                    </div>
                                                                    <div class="form-check">
                                                                        <input class="form-check-input bidr" type="radio" name="bid-martial" id="mstatus" value="A widower" />
                                                                        <label class="form-check-label" for="widower">A widower</label>
                                                                    </div>
                                                                    <div class="form-check">
                                                                        <input class="form-check-input bidr" type="radio" name="bid-martial" id="mstatus" value="Separated" />
                                                                        <label class="form-check-label" for="Separated">Separated</label>
                                                                    </div>
                                                                </>

                                                        }
                                                    </div>
                                                </div>
                                                <div className='col-sm-3'>
                                                    <div className='form-group'>
                                                        <label className="control-label">Israeli resident</label>
                                                        {
                                                            (form.length != 0 && form['bid-israeli'] != null) ?
                                                                <>
                                                                    <div class="form-check">
                                                                        <span className='text-success font-weight-bold'>{form['bid-israeli']}</span>
                                                                    </div>
                                                                </>

                                                                :
                                                                <>
                                                                    <div class="form-check">
                                                                        <input class="form-check-input bidr" type="radio" name="bid-israeli" id="resident" value="Yes" />
                                                                        <label class="form-check-label" for="Yes">Yes</label>
                                                                    </div>
                                                                    <div class="form-check">
                                                                        <input class="form-check-input bidr" type="radio" name="bid-israeli" id="resident" value="No" />
                                                                        <label class="form-check-label" for="No">No</label>
                                                                    </div>
                                                                </>
                                                        }


                                                    </div>
                                                </div>
                                                <div className='col-sm-3'>
                                                    <div className='form-group'>
                                                        <label className="control-label">Member of a kibbutz / cooperative session</label>
                                                        {
                                                            (form.length != 0 && form['bid-member'] != null) ?
                                                                <>
                                                                    <div class="form-check">
                                                                        <span className='text-success font-weight-bold'>{form['bid-member']}</span>
                                                                    </div>
                                                                </>
                                                                :
                                                                <>
                                                                    <div class="form-check">
                                                                        <input class="form-check-input bidr" type="radio" name="bid-member" id="session" value="Yes" />
                                                                        <label class="form-check-label" for="Yes">Yes</label>
                                                                    </div>
                                                                    <div class="form-check">
                                                                        <input class="form-check-input" type="radio" name="bid-member" id="session" value="No" />
                                                                        <label class="form-check-label" for="No">No</label>
                                                                    </div>

                                                                </>
                                                        }

                                                    </div>
                                                </div>
                                                <div className='col-sm-3'>
                                                    <div className='form-group'>
                                                        <label className="control-label">HMO member</label>
                                                        {
                                                            (form.length != 0 && form['bid-hmo'] != null) ?
                                                                <>
                                                                    <div class="form-check">
                                                                        <span className='text-success font-weight-bold'>{form['bid-hmo']}</span>
                                                                    </div>
                                                                </>
                                                                :
                                                                <>
                                                                    <div class="form-check">
                                                                        <input class="form-check-input bidr" type="radio" name="bid-hmo" id="member" value="Yes" />
                                                                        <label class="form-check-label" for="Yes">Yes</label>
                                                                    </div>
                                                                    <div class="form-check">
                                                                        <input class="form-check-input bidr" type="radio" name="bid-hmo" id="member" value="No" />
                                                                        <label class="form-check-label" for="No">No</label>
                                                                    </div>
                                                                </>
                                                        }

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-sm-12'>
                                <div aria-hidden={selected !== "passport" ? true : false}>
                                    <div className='row'>
                                        <div className='col-sm-4'>
                                            <div className='form-group'>
                                                <label className='control-label'>Country of the Passport</label>
                                                {
                                                    (form.length != 0 && form['country'] != null) ?
                                                        <input type="text" className='form-control' value={form['country']} readOnly />
                                                        :
                                                        <select id="country" name="country" class="form-control">
                                                            <option value="Afghanistan">Afghanistan</option>
                                                            <option value="Åland Islands">Åland Islands</option>
                                                            <option value="Albania">Albania</option>
                                                            <option value="Algeria">Algeria</option>
                                                            <option value="American Samoa">American Samoa</option>
                                                            <option value="Andorra">Andorra</option>
                                                            <option value="Angola">Angola</option>
                                                            <option value="Anguilla">Anguilla</option>
                                                            <option value="Antarctica">Antarctica</option>
                                                            <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                                                            <option value="Argentina">Argentina</option>
                                                            <option value="Armenia">Armenia</option>
                                                            <option value="Aruba">Aruba</option>
                                                            <option value="Australia">Australia</option>
                                                            <option value="Austria">Austria</option>
                                                            <option value="Azerbaijan">Azerbaijan</option>
                                                            <option value="Bahamas">Bahamas</option>
                                                            <option value="Bahrain">Bahrain</option>
                                                            <option value="Bangladesh">Bangladesh</option>
                                                            <option value="Barbados">Barbados</option>
                                                            <option value="Belarus">Belarus</option>
                                                            <option value="Belgium">Belgium</option>
                                                            <option value="Belize">Belize</option>
                                                            <option value="Benin">Benin</option>
                                                            <option value="Bermuda">Bermuda</option>
                                                            <option value="Bhutan">Bhutan</option>
                                                            <option value="Bolivia">Bolivia</option>
                                                            <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                                                            <option value="Botswana">Botswana</option>
                                                            <option value="Bouvet Island">Bouvet Island</option>
                                                            <option value="Brazil">Brazil</option>
                                                            <option value="British Indian Ocean Territory">British Indian Ocean Territory</option>
                                                            <option value="Brunei Darussalam">Brunei Darussalam</option>
                                                            <option value="Bulgaria">Bulgaria</option>
                                                            <option value="Burkina Faso">Burkina Faso</option>
                                                            <option value="Burundi">Burundi</option>
                                                            <option value="Cambodia">Cambodia</option>
                                                            <option value="Cameroon">Cameroon</option>
                                                            <option value="Canada">Canada</option>
                                                            <option value="Cape Verde">Cape Verde</option>
                                                            <option value="Cayman Islands">Cayman Islands</option>
                                                            <option value="Central African Republic">Central African Republic</option>
                                                            <option value="Chad">Chad</option>
                                                            <option value="Chile">Chile</option>
                                                            <option value="China">China</option>
                                                            <option value="Christmas Island">Christmas Island</option>
                                                            <option value="Cocos (Keeling) Islands">Cocos (Keeling) Islands</option>
                                                            <option value="Colombia">Colombia</option>
                                                            <option value="Comoros">Comoros</option>
                                                            <option value="Congo">Congo</option>
                                                            <option value="Congo, The Democratic Republic of The">Congo, The Democratic Republic of The</option>
                                                            <option value="Cook Islands">Cook Islands</option>
                                                            <option value="Costa Rica">Costa Rica</option>
                                                            <option value="Cote D'ivoire">Cote D'ivoire</option>
                                                            <option value="Croatia">Croatia</option>
                                                            <option value="Cuba">Cuba</option>
                                                            <option value="Cyprus">Cyprus</option>
                                                            <option value="Czech Republic">Czech Republic</option>
                                                            <option value="Denmark">Denmark</option>
                                                            <option value="Djibouti">Djibouti</option>
                                                            <option value="Dominica">Dominica</option>
                                                            <option value="Dominican Republic">Dominican Republic</option>
                                                            <option value="Ecuador">Ecuador</option>
                                                            <option value="Egypt">Egypt</option>
                                                            <option value="El Salvador">El Salvador</option>
                                                            <option value="Equatorial Guinea">Equatorial Guinea</option>
                                                            <option value="Eritrea">Eritrea</option>
                                                            <option value="Estonia">Estonia</option>
                                                            <option value="Ethiopia">Ethiopia</option>
                                                            <option value="Falkland Islands (Malvinas)">Falkland Islands (Malvinas)</option>
                                                            <option value="Faroe Islands">Faroe Islands</option>
                                                            <option value="Fiji">Fiji</option>
                                                            <option value="Finland">Finland</option>
                                                            <option value="France">France</option>
                                                            <option value="French Guiana">French Guiana</option>
                                                            <option value="French Polynesia">French Polynesia</option>
                                                            <option value="French Southern Territories">French Southern Territories</option>
                                                            <option value="Gabon">Gabon</option>
                                                            <option value="Gambia">Gambia</option>
                                                            <option value="Georgia">Georgia</option>
                                                            <option value="Germany">Germany</option>
                                                            <option value="Ghana">Ghana</option>
                                                            <option value="Gibraltar">Gibraltar</option>
                                                            <option value="Greece">Greece</option>
                                                            <option value="Greenland">Greenland</option>
                                                            <option value="Grenada">Grenada</option>
                                                            <option value="Guadeloupe">Guadeloupe</option>
                                                            <option value="Guam">Guam</option>
                                                            <option value="Guatemala">Guatemala</option>
                                                            <option value="Guernsey">Guernsey</option>
                                                            <option value="Guinea">Guinea</option>
                                                            <option value="Guinea-bissau">Guinea-bissau</option>
                                                            <option value="Guyana">Guyana</option>
                                                            <option value="Haiti">Haiti</option>
                                                            <option value="Heard Island and Mcdonald Islands">Heard Island and Mcdonald Islands</option>
                                                            <option value="Holy See (Vatican City State)">Holy See (Vatican City State)</option>
                                                            <option value="Honduras">Honduras</option>
                                                            <option value="Hong Kong">Hong Kong</option>
                                                            <option value="Hungary">Hungary</option>
                                                            <option value="Iceland">Iceland</option>
                                                            <option value="India">India</option>
                                                            <option value="Indonesia">Indonesia</option>
                                                            <option value="Iran, Islamic Republic of">Iran, Islamic Republic of</option>
                                                            <option value="Iraq">Iraq</option>
                                                            <option value="Ireland">Ireland</option>
                                                            <option value="Isle of Man">Isle of Man</option>
                                                            <option value="Israel">Israel</option>
                                                            <option value="Italy">Italy</option>
                                                            <option value="Jamaica">Jamaica</option>
                                                            <option value="Japan">Japan</option>
                                                            <option value="Jersey">Jersey</option>
                                                            <option value="Jordan">Jordan</option>
                                                            <option value="Kazakhstan">Kazakhstan</option>
                                                            <option value="Kenya">Kenya</option>
                                                            <option value="Kiribati">Kiribati</option>
                                                            <option value="Korea, Democratic People's Republic of">Korea, Democratic People's Republic of</option>
                                                            <option value="Korea, Republic of">Korea, Republic of</option>
                                                            <option value="Kuwait">Kuwait</option>
                                                            <option value="Kyrgyzstan">Kyrgyzstan</option>
                                                            <option value="Lao People's Democratic Republic">Lao People's Democratic Republic</option>
                                                            <option value="Latvia">Latvia</option>
                                                            <option value="Lebanon">Lebanon</option>
                                                            <option value="Lesotho">Lesotho</option>
                                                            <option value="Liberia">Liberia</option>
                                                            <option value="Libyan Arab Jamahiriya">Libyan Arab Jamahiriya</option>
                                                            <option value="Liechtenstein">Liechtenstein</option>
                                                            <option value="Lithuania">Lithuania</option>
                                                            <option value="Luxembourg">Luxembourg</option>
                                                            <option value="Macao">Macao</option>
                                                            <option value="Macedonia, The Former Yugoslav Republic of">Macedonia, The Former Yugoslav Republic of</option>
                                                            <option value="Madagascar">Madagascar</option>
                                                            <option value="Malawi">Malawi</option>
                                                            <option value="Malaysia">Malaysia</option>
                                                            <option value="Maldives">Maldives</option>
                                                            <option value="Mali">Mali</option>
                                                            <option value="Malta">Malta</option>
                                                            <option value="Marshall Islands">Marshall Islands</option>
                                                            <option value="Martinique">Martinique</option>
                                                            <option value="Mauritania">Mauritania</option>
                                                            <option value="Mauritius">Mauritius</option>
                                                            <option value="Mayotte">Mayotte</option>
                                                            <option value="Mexico">Mexico</option>
                                                            <option value="Micronesia, Federated States of">Micronesia, Federated States of</option>
                                                            <option value="Moldova, Republic of">Moldova, Republic of</option>
                                                            <option value="Monaco">Monaco</option>
                                                            <option value="Mongolia">Mongolia</option>
                                                            <option value="Montenegro">Montenegro</option>
                                                            <option value="Montserrat">Montserrat</option>
                                                            <option value="Morocco">Morocco</option>
                                                            <option value="Mozambique">Mozambique</option>
                                                            <option value="Myanmar">Myanmar</option>
                                                            <option value="Namibia">Namibia</option>
                                                            <option value="Nauru">Nauru</option>
                                                            <option value="Nepal">Nepal</option>
                                                            <option value="Netherlands">Netherlands</option>
                                                            <option value="Netherlands Antilles">Netherlands Antilles</option>
                                                            <option value="New Caledonia">New Caledonia</option>
                                                            <option value="New Zealand">New Zealand</option>
                                                            <option value="Nicaragua">Nicaragua</option>
                                                            <option value="Niger">Niger</option>
                                                            <option value="Nigeria">Nigeria</option>
                                                            <option value="Niue">Niue</option>
                                                            <option value="Norfolk Island">Norfolk Island</option>
                                                            <option value="Northern Mariana Islands">Northern Mariana Islands</option>
                                                            <option value="Norway">Norway</option>
                                                            <option value="Oman">Oman</option>
                                                            <option value="Pakistan">Pakistan</option>
                                                            <option value="Palau">Palau</option>
                                                            <option value="Palestinian Territory, Occupied">Palestinian Territory, Occupied</option>
                                                            <option value="Panama">Panama</option>
                                                            <option value="Papua New Guinea">Papua New Guinea</option>
                                                            <option value="Paraguay">Paraguay</option>
                                                            <option value="Peru">Peru</option>
                                                            <option value="Philippines">Philippines</option>
                                                            <option value="Pitcairn">Pitcairn</option>
                                                            <option value="Poland">Poland</option>
                                                            <option value="Portugal">Portugal</option>
                                                            <option value="Puerto Rico">Puerto Rico</option>
                                                            <option value="Qatar">Qatar</option>
                                                            <option value="Reunion">Reunion</option>
                                                            <option value="Romania">Romania</option>
                                                            <option value="Russian Federation">Russian Federation</option>
                                                            <option value="Rwanda">Rwanda</option>
                                                            <option value="Saint Helena">Saint Helena</option>
                                                            <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                                                            <option value="Saint Lucia">Saint Lucia</option>
                                                            <option value="Saint Pierre and Miquelon">Saint Pierre and Miquelon</option>
                                                            <option value="Saint Vincent and The Grenadines">Saint Vincent and The Grenadines</option>
                                                            <option value="Samoa">Samoa</option>
                                                            <option value="San Marino">San Marino</option>
                                                            <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                                                            <option value="Saudi Arabia">Saudi Arabia</option>
                                                            <option value="Senegal">Senegal</option>
                                                            <option value="Serbia">Serbia</option>
                                                            <option value="Seychelles">Seychelles</option>
                                                            <option value="Sierra Leone">Sierra Leone</option>
                                                            <option value="Singapore">Singapore</option>
                                                            <option value="Slovakia">Slovakia</option>
                                                            <option value="Slovenia">Slovenia</option>
                                                            <option value="Solomon Islands">Solomon Islands</option>
                                                            <option value="Somalia">Somalia</option>
                                                            <option value="South Africa">South Africa</option>
                                                            <option value="South Georgia and The South Sandwich Islands">South Georgia and The South Sandwich Islands</option>
                                                            <option value="Spain">Spain</option>
                                                            <option value="Sri Lanka">Sri Lanka</option>
                                                            <option value="Sudan">Sudan</option>
                                                            <option value="Suriname">Suriname</option>
                                                            <option value="Svalbard and Jan Mayen">Svalbard and Jan Mayen</option>
                                                            <option value="Swaziland">Swaziland</option>
                                                            <option value="Sweden">Sweden</option>
                                                            <option value="Switzerland">Switzerland</option>
                                                            <option value="Syrian Arab Republic">Syrian Arab Republic</option>
                                                            <option value="Taiwan">Taiwan</option>
                                                            <option value="Tajikistan">Tajikistan</option>
                                                            <option value="Tanzania, United Republic of">Tanzania, United Republic of</option>
                                                            <option value="Thailand">Thailand</option>
                                                            <option value="Timor-leste">Timor-leste</option>
                                                            <option value="Togo">Togo</option>
                                                            <option value="Tokelau">Tokelau</option>
                                                            <option value="Tonga">Tonga</option>
                                                            <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                                                            <option value="Tunisia">Tunisia</option>
                                                            <option value="Turkey">Turkey</option>
                                                            <option value="Turkmenistan">Turkmenistan</option>
                                                            <option value="Turks and Caicos Islands">Turks and Caicos Islands</option>
                                                            <option value="Tuvalu">Tuvalu</option>
                                                            <option value="Uganda">Uganda</option>
                                                            <option value="Ukraine">Ukraine</option>
                                                            <option value="United Arab Emirates">United Arab Emirates</option>
                                                            <option value="United Kingdom">United Kingdom</option>
                                                            <option value="United States">United States</option>
                                                            <option value="United States Minor Outlying Islands">United States Minor Outlying Islands</option>
                                                            <option value="Uruguay">Uruguay</option>
                                                            <option value="Uzbekistan">Uzbekistan</option>
                                                            <option value="Vanuatu">Vanuatu</option>
                                                            <option value="Venezuela">Venezuela</option>
                                                            <option value="Viet Nam">Viet Nam</option>
                                                            <option value="Virgin Islands, British">Virgin Islands, British</option>
                                                            <option value="Virgin Islands, U.S.">Virgin Islands, U.S.</option>
                                                            <option value="Wallis and Futuna">Wallis and Futuna</option>
                                                            <option value="Western Sahara">Western Sahara</option>
                                                            <option value="Yemen">Yemen</option>
                                                            <option value="Zambia">Zambia</option>
                                                            <option value="Zimbabwe">Zimbabwe</option>
                                                        </select>
                                                }
                                            </div>
                                        </div>
                                        <div className='col-sm-4'>
                                            <div className='form-group'>
                                                <label className='control-label'>Passport number*</label>
                                                <input type='text' className='form-control pid' name="p-passport_number" placeholder='Passport Number' />
                                            </div>
                                        </div>
                                        <div className='col-sm-4'>
                                            <div className='form-group'>
                                                <label className='control-label'>Passport photo</label>
                                                <input type="file" onChange={e => { handleFile2(e.target.files[0]) }} name="p-file" style={{ display: "block" }} />
                                                <img src={(file2)} className="img-fluid pid" style={{ maxWidth: "70px", marginTop: "10px" }} />
                                                {
                                                    form && form.signature != null && <button type="button" className="btn btn-pink m-2"
                                                        onClick={(e) => {
                                                            let sf = document.querySelector('.showfile');
                                                            sf.setAttribute('src', form['p-file']);
                                                            sf.style.width = '100%';
                                                        }}
                                                        data-toggle="modal" data-target="#exampleModal">
                                                        view uploaded File
                                                    </button>
                                                }
                                            </div>
                                        </div>
                                        <div className='col-sm-4'>
                                            <div className='form-group'>
                                                <label className='control-label'>Date of Birth*</label>
                                                <input type="date" name="p-dob" className='form-control pid' />
                                            </div>
                                        </div>
                                        <div className='col-sm-4'>
                                            <div className='form-group'>
                                                <label className='control-label'>Settlement*</label>
                                                {
                                                    (form.length != 0 && form['p-settlement'] != null) ?
                                                        <input type="text" className='form-control' value={form['p-settlement']} readOnly />
                                                        :
                                                        <select className='form-control pid' name="p-settlement">
                                                            <option value='Jerusalem'>Jerusalem</option>
                                                            <option value='Tel Aviv Jaffa'>Tel Aviv Jaffa</option>
                                                            <option value='Haifa'>Haifa</option>
                                                            <option value='Petah Tikva'>Petah Tikva</option>
                                                            <option value='Beer Sheva'>Beer Sheva</option>
                                                            <option value='Shefram'>Shefram</option>
                                                            <option value='Rishon Lezion'>Rishon Lezion</option>
                                                            <option value='Netanya'>Netanya</option>
                                                            <option value='Ashkelon'>Ashkelon</option>
                                                            <option value='Ramat Gan'>Ramat Gan</option>
                                                        </select>
                                                }
                                            </div>
                                        </div>
                                        <div className='col-sm-4'>
                                            <div className='form-group'>
                                                <label className='control-label'>Street*</label>
                                                <input type="text" className='form-control pid' name="p-street" placeholder='Street' required />
                                            </div>
                                        </div>
                                        <div className='col-sm-4'>
                                            <div className='form-group'>
                                                <label className='control-label'>House Number*</label>
                                                <input type="text" className='form-control pid' name="p-house_number" placeholder='House Number' required />
                                            </div>
                                        </div>
                                        <div className='col-sm-4'>
                                            <div className='form-group'>
                                                <label className='control-label'>Postal Code</label>
                                                <input type="text" className='form-control pid' name="p-postal_code" placeholder='Postal Code' />
                                            </div>
                                        </div>
                                        <div className='col-sm-4'>
                                            <div className='form-group'>
                                                <label className='control-label'>Mobile number*</label>
                                                <input type="text" className='form-control pid' name="p-mobile_number" placeholder='Mobile number' required />
                                            </div>
                                        </div>
                                        <div className='col-sm-4'>
                                            <div className='form-group'>
                                                <label className='control-label'>Phone number</label>
                                                <input type="text" className='form-control pid' name="p-phone_number" placeholder='Phone number' />
                                            </div>
                                        </div>
                                        <div className='col-sm-4'>
                                            <div className='form-group'>
                                                <label className='control-label'>E-mail address*</label>
                                                <input type="email" className='form-control pid' name="p-email" placeholder='E-mail address' required />
                                            </div>
                                        </div>
                                        <div className='col-sm-4'>
                                            <div className='form-group'>
                                                <label className="control-label">Sex</label>
                                                {
                                                    (form.length != 0 && form['p-sex'] != null) ?
                                                        <>
                                                            <div class="form-check">
                                                                <span className='text-success font-weight-bold'>{form['p-sex']}</span>
                                                            </div>
                                                        </> :
                                                        <>
                                                            <div class="form-check">
                                                                <input class="form-check-input pidr" type="radio" name="p-sex" id="sex" value="Male" checked />
                                                                <label class="form-check-label" for="Male">Male</label>
                                                            </div>
                                                            <div class="form-check">
                                                                <input class="form-check-input pidr" type="radio" name="p-sex" id="sex" value="Female" />
                                                                <label class="form-check-label" for="Female">Female</label>
                                                            </div>
                                                        </>
                                                }

                                            </div>
                                        </div>
                                        <div className='col-sm-4'>
                                            <div className='form-group'>
                                                <label className="control-label">Martial Status</label>
                                                {
                                                    (form.length != 0 && form['p-martial'] != null) ?
                                                        <>
                                                            <div class="form-check">
                                                                <span className='text-success font-weight-bold'>{form['p-martial']}</span>
                                                            </div>
                                                        </>
                                                        :
                                                        <>
                                                            <div class="form-check">
                                                                <input class="form-check-input pidr" type="radio" name="p-martial" id="mstatus2" value="Single" />
                                                                <label class="form-check-label" for="Single">Single</label>
                                                            </div>
                                                            <div class="form-check">
                                                                <input class="form-check-input pidr" type="radio" name="p-martial" id="mstatus2" value="Married" />
                                                                <label class="form-check-label" for="Married">Married</label>
                                                            </div>
                                                            <div class="form-check">
                                                                <input class="form-check-input pidr" type="radio" name="p-martial" id="mstatus2" value="Divorcee" />
                                                                <label class="form-check-label" for="Divorcee">Divorcee</label>
                                                            </div>
                                                            <div class="form-check">
                                                                <input class="form-check-input pidr" type="radio" name="p-martial" id="mstatus2" value="A widower" />
                                                                <label class="form-check-label" for="widower">A widower</label>
                                                            </div>
                                                            <div class="form-check">
                                                                <input class="form-check-input pidr" type="radio" name="p-martial" id="mstatus2" value="Separated" />
                                                                <label class="form-check-label" for="Separated">Separated</label>
                                                            </div>
                                                        </>
                                                }

                                            </div>
                                        </div>
                                        <div className='col-sm-4'>
                                            <div className='form-group'>
                                                <label className="control-label">HMO member</label>
                                                {
                                                    (form.length != 0 && form['p-hmo'] != null) ?
                                                        <>
                                                            <div class="form-check">
                                                                <span className='text-success font-weight-bold'>{form['p-hmo']}</span>
                                                            </div>
                                                        </> :
                                                        <>
                                                            <div class="form-check">
                                                                <input class="form-check-input pidr" type="radio" name="p-hmo" id="hmoMember" value="Yes" />
                                                                <label class="form-check-label" for="Yes">Yes</label>
                                                            </div>
                                                            <div class="form-check">
                                                                <input class="form-check-input pidr" type="radio" name="p-hmo" id="hmoMember" value="No" />
                                                                <label class="form-check-label" for="No">No</label>
                                                            </div>
                                                        </>

                                                }

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className=''></div>
                            </div>
                        </div>
                    </div>
                    <div className='box-heading'>
                        <h2>C. Details of my income from this employer</h2>
                        <div className='form-group'>
                            <label className='control-label'>I accept*</label>
                            {
                                (form.length != 0 && form['income'] != null) ?
                                    <>
                                        <div class="form-check">
                                            <span className='text-success font-weight-bold'>{form['income'].income}</span>
                                        </div>

                                    </>
                                    :
                                    <>
                                        <div className='row'>
                                            <div className='col-sm-4'>
                                                <div className='form-group'>
                                                    <input type='checkbox' value='A month salary' name='income' /> A month salary
                                                </div>
                                            </div>
                                            <div className='col-sm-4'>
                                                <div className='form-group'>
                                                    <input type='checkbox' value='Salary for an additional position' name='income' /> Salary for an additional position
                                                </div>
                                            </div>
                                            <div className='col-sm-4'>
                                                <div className='form-group'>
                                                    <input type='checkbox' value='Partial salary' name='income' /> Partial salary
                                                </div>
                                            </div>
                                            <div className='col-sm-4'>
                                                <div className='form-group'>
                                                    <input type='checkbox' value='Scholarship' name='income' /> Scholarship
                                                </div>
                                            </div>
                                            <div className='col-sm-4'>
                                                <div className='form-group'>
                                                    <input type='checkbox' value='Allowance' name='income' /> Allowance
                                                </div>
                                            </div>
                                            <div className='col-sm-4'>
                                                <div className='form-group'>
                                                    <input type='checkbox' value='Wages (Daily worker)' name='income' /> Wages (Daily worker)
                                                </div>
                                            </div>
                                            <div className='col-sm-6'>
                                                <div className='form-group'>
                                                    <label className='control-label'>Date of commencement of employment in the tax year*</label>
                                                    <input type='date' className='form-control' name='taxDate' />
                                                </div>
                                            </div>
                                        </div>
                                    </>
                            }

                        </div>
                    </div>
                    <div className='box-heading'>
                        <h2>D. Disclaimer</h2>
                        <p>I declare that the details I provided in this form are complete and correct. I know that omitting or providing incorrect information is a violation of the Income Tax Ordinance.</p>
                        <p>I undertake to inform the employer of any change that will apply to my personal details and the details above within a week from the date of the change.</p>
                        <p>
                            {
                                (form && form.signature != null) ?
                                    <img src={form.signature} /> :
                                    <>
                                        <SignatureCanvas
                                            penColor="black"
                                            canvasProps={{ className: 'sign101' }}
                                            ref={sigRef}
                                            onEnd={handleSignatureEnd}
                                        />
                                        <p><button className='btn btn-warning' onClick={clearSignature}>Clear</button></p>

                                    </>
                            }

                        </p>
                    </div>

                </div>
                <div className="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">

                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="form-group">
                                            <img src="#" className='showfile' />

                                        </div>
                                    </div>

                                </div>

                            </div>
                            <div className="modal-footer">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*<div className="row pb-3">
                <div className="col-sm-10">
                {file &&
                <a href={ (`/api/showPdf/${params.id}`)} target="_blank" className="btn btn-pink">
                    View Worker 101 Form
                </a>
                }
                 </div>
                <div className="col-sm-2">
                <button type="button" className="btn btn-pink" data-toggle="modal" data-target="#exampleModal">
                    Add File
                </button>
                 </div>
            </div>
          


            <div className="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Add File</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">

                            <div className="row">
                                

                               
                                
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <label className="control-label">
                                            File
                                        </label>
                                         <input type="file" onChange={handlePdfUpload} />

                                    </div>
                                </div>

                            </div>


                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary closedoc" data-dismiss="modal">Close</button>
                            <button type="button" onClick={handleFormSubmit} className="btn btn-primary">Save File</button>
                        </div>
                    </div>
                </div>
            </div>*/}
        </div>



    )
}
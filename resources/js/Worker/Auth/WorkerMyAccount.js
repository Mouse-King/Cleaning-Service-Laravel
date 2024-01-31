import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function WorkerMyAccount() {
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [renewal_date, setRenewalDate] = useState('');
    const [gender, setGender] = useState('male');
    const [payment_hour, setPaymentHour] = useState(0);
    const [worker_id, setWorkerId] = useState(Math.random().toString().concat("0".repeat(3)).substr(2, 5));
    const [password, setPassword] = useState('');
    const [lng, setLng] = useState("");
    const [address, setAddress] = useState('');
    const [skill, setSkill] = useState([]);
    const [itemStatus, setItemStatus] = useState('');
    const [country, setCountry] = useState('Israel');

    const [countries, setCountries] = useState([]);
    const [avl_skill, setAvlSkill] = useState([]);

    const [errors, setErrors] = useState([]);
    const params = useParams();
    const navigate = useNavigate();
    const alert = useAlert();
    const id = localStorage.getItem('worker-id');
    const { t } = useTranslation();
    const handleSkills = (e) => {
        const value = e.target.value;
        const checked = e.target.checked;
        if (checked) {
            setSkill([...skill, value]);
        } else {
            setSkill(skill.filter((e) => (e !== value)));
        }
    }
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("worker-token"),
    };

    const handleUpdate = (e) => {
        e.preventDefault();
       
        const data = {
            "firstname": firstname,
            "lastname": lastname,
            "phone": phone,
            "email": email,
            "address": address,
            "renewal_visa": renewal_date,
            "gender": gender,
            "payment_hour": payment_hour,
            "lng": (lng != 0) ? lng : 'heb',
            "worker_id": worker_id,
            "password": password,
            "status": itemStatus,
            "country": country,
        }

        axios
            .post(`/api/update_details/${id}`, data, { headers })
            .then((response) => {
                if (response.data.errors) {
                    setErrors(response.data.errors);
                } else {
                    alert.success("Profile has been updated successfully");
                }
            });
    };


    const getWorker = () => {
        axios
            .get(`/api/details`, { headers })
            .then((response) => {
                let w = response.data.success;
                setFirstName(w.firstname);
                setLastName(w.lastname);
                setEmail(w.email);
                setPhone(w.phone);
                setRenewalDate(w.renewal_visa);
                setGender(w.gender);
                setPaymentHour(w.payment_per_hour);
                setWorkerId(w.worker_id);
                setPassword(w.passcode);
                setSkill(w.skill);
                setAddress(w.address);
                setItemStatus(w.status);
                setLng(w.lng);
                setCountry(w.country);
            });
    };
    const getAvailableSkill = () => {
        axios
            .get(`/api/admin/get_services`, { headers })
            .then((response) => {
                setAvlSkill(response.data.services);
            });
    };
    const getCountries = () => {
        axios
            .get(`/api/admin/countries`, { headers })
            .then((response) => {
                setCountries(response.data.countries);
            });
    };
    useEffect(() => {
        getWorker();
        getCountries();
        getAvailableSkill();

    }, []);
    return (
        <>
            <div className="edit-customer worker-account">
                <div className="dashBox p-4">
                    <form>
                        <div className='row'>
                            <div className='col-sm-6'>
                                <div className='form-group'>
                                    <label className='control-label'>{t('worker.settings.f_name')} *</label>
                                    <input type='text' value={firstname} onChange={(e) => setFirstName(e.target.value)} className='form-control' required placeholder={t('worker.settings.f_name')} />
                                    {errors.firstname ? (
                                        <small className="text-danger mb-1">
                                            {errors.firstname}
                                        </small>
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </div>
                            <div className='col-sm-6'>
                                <div className='form-group'>
                                    <label className='control-label'>{t('worker.settings.l_name')}</label>
                                    <input type='text' value={lastname} onChange={(e) => setLastName(e.target.value)} className='form-control' placeholder={t('worker.settings.l_name')} />
                                </div>
                            </div>
                            <div className='col-sm-6'>
                                <div className='form-group'>
                                    <label className='control-label'>{t('worker.settings.email')}</label>
                                    <input type='tyoe' value={email} onChange={(e) => setEmail(e.target.value)} className='form-control' placeholder={t('worker.settings.email')} />
                                    {errors.email ? (
                                        <small className="text-danger mb-1">
                                            {errors.email}
                                        </small>
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </div>
                            <div className='col-sm-6'>
                                <div className='form-group'>
                                    <label className='control-label'>{t('worker.settings.phone')}</label>
                                    <input type='tel' value={phone} onChange={(e) => setPhone(e.target.value)} className='form-control' placeholder={t('worker.settings.phone')} />
                                    {errors.phone ? (
                                        <small className="text-danger mb-1">
                                            {errors.phone}
                                        </small>
                                    ) : (
                                        ""
                                    )}
                                </div>
                            </div>
                            <div className='col-sm-6'>
                                <div className='form-group gender-group'>
                                    <label className='control-label d-block'>{t('worker.settings.gender')}</label>
                                    <div className="form-check-inline">
                                        <label className="form-check-label">
                                            <input type="radio" className="form-check-input" value="male" style={{height: "unset"}} onChange={(e) => setGender(e.target.value)} checked={gender === 'male'} />{t('worker.settings.male')}
                                        </label>
                                    </div>
                                    <div className="form-check-inline">
                                        <label className="form-check-label">
                                            <input type="radio" className="form-check-input" value="female" style={{height: "unset"}} onChange={(e) => setGender(e.target.value)} checked={gender === 'female'} />{t('worker.settings.female')}
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className='col-sm-6'>
                                <div className='form-group'>
                                    <label className='control-label'>{t('worker.settings.p_ph')}</label>
                                    <input type='text' value={payment_hour} onChange={(e) => setPaymentHour(e.target.value)} className='form-control' placeholder={t('worker.settings.p_ph')} />
                                </div>

                            </div>
                            <div className='col-sm-6'>
                                <div className='form-group'>
                                    <label className='control-label'>{t('worker.settings.w_id')}</label>
                                    <input type='text' value={worker_id} onChange={(e) => setWorkerId(e.target.value)} className='form-control' placeholder={t('worker.settings.w_id')} />
                                    {errors.worker_id ? (
                                        <small className="text-danger mb-1">
                                            {errors.worker_id}
                                        </small>
                                    ) : (
                                        ""
                                    )}
                                </div>

                            </div>
                            <div className='col-sm-6'>
                                <div className='form-group'>
                                    <label className='control-label'>{t('worker.settings.pass')} *</label>
                                    <input type='text' value={password} onChange={(e) => setPassword(e.target.value)} className='form-control' required placeholder={t('worker.settings.pass')} />
                                </div>
                            </div>
                            <div className='col-sm-6'>
                                <div className="form-group">
                                    <label className="control-label">{t('worker.settings.lng')}</label>

                                    <select
                                        className="form-control"
                                        value={lng}
                                        onChange={(e) => setLng(e.target.value)}
                                    >
                                        <option value={0}>Please select language</option>
                                        <option value="heb" selected={lng == "heb"}>Hebrew</option>
                                        <option value="en" selected={lng == "en"}>English</option>
                                    </select>
                                </div>
                            </div>
                            <div className='col-sm-6'>
                                <div className="form-group">
                                    <label className="control-label">{t('worker.settings.country')}</label>

                                    <select
                                        className="form-control"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                    >
                                        {countries && countries.map((item, index) => (

                                            <option value={item.name} selected={(country == item.name) ? true : false}>{item.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {country != 'Israel' &&
                                <div className='col-sm-6'>
                                    <div className='form-group'>
                                        <label className='control-label'>{t('worker.settings.renewal_visa')} </label>
                                        <input type='date' selected={renewal_date} value={renewal_date} onChange={(e) => setRenewalDate(e.target.value)} className='form-control' placeholder={t('worker.settings.email')} />
                                    </div>

                                </div>
                            }
                        </div>
                        <div className='form-group'>
                            <label className='control-label'>{t('worker.settings.address')}</label>
                            <input type='text' value={address} onChange={(e) => setAddress(e.target.value)} className='form-control' placeholder={t('worker.settings.address')} />
                            {errors.address ? (
                                <small className="text-danger mb-1">
                                    {errors.address}
                                </small>
                            ) : (
                                ""
                            )}
                        </div>
                        <div className='col-sm-12'>
                            <div className='form-group skills-group'>
                                <label className='control-label'>{t('worker.settings.skills')}</label>
                                {avl_skill && avl_skill.map((item, index) => {
                                   
                                   if(skill !== 'null' && skill!= null && skill.length > 0 ){
                                    return (
                                        <div>
                                            {   
                                                (JSON.parse(skill).includes((item.id).toString())) ?
                                                    <>
                                                        <div className="form-check col-sm-12" key={index}>
                                                            <label className="form-check-label col-3 text-center">
                                                                <p className="form-control"> {item.name}</p>
                                                            </label>
                                                        </div>
                                                    </>
                                                    : ''
                                    }

                                            {/*<input type="checkbox" className="form-check-input" name="skills" value={item.id} onChange={handleSkills} checked={skill.includes((item.id).toString())} /><span>{item.name}</span> */}

                                        </div>)}
                                })}
                            </div>
                        </div>
                        <div className='form-group mt-4'>
                            <label className='control-label'>{t('worker.settings.status')}</label>
                            <select className='form-control' value={itemStatus} onChange={(e) => setItemStatus(e.target.value)}>
                                <option>Please select</option>
                                <option value="1">Enable</option>
                                <option value="0">Disable</option>
                            </select>
                            {errors.status ? (
                                <small className="text-danger mb-1">
                                    {errors.status}
                                </small>
                            ) : (
                                ""
                            )}
                        </div>
                        <div className="form-group text-center">
                            <input type='submit' value={t('worker.settings.update')} onClick={handleUpdate} className="btn btn-primary saveBtn" />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

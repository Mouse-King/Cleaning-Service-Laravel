import React, { useState, useEffect } from 'react'
import Sidebar from '../../Layouts/Sidebar'
import { useParams, useNavigate } from 'react-router-dom';
import { useAlert } from 'react-alert';
import axios from 'axios';

export default function EditTeam() {

    const [name, setName] = useState(null);
    const [hebname, setHebName] = useState(null);
    const [email, setEmail] = useState(null);
    const [phone, setPhone] = useState(null);
    const [address, setAddress] = useState(null);
    const [password, setPassword] = useState(null);
    const [confirmPassword, setConfirmPassword] = useState(null);
    const [status, setStatus] = useState(null);
    const [color, setColor] = useState(null);
    const [permission, setPermission] = useState(null);

    const alert = useAlert();
    const param = useParams();
    const navigate = useNavigate();
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };

    const handleUpdate = () => {
        let perm = document.querySelector('input[name="role"]:checked').value;
        const data = {
            name: name,
            heb_name:hebname,
            email: email,
            phone: phone,
            address, address,
            color: (!color) ? '#fff' : color,
            password: password,
            confirmation: confirmPassword,
            status: (!status) ? 1 : status,
            role: perm
        }

        axios
            .put(`/api/admin/team/${param.id}`, data, { headers })
            .then((res) => {
                if (res.data.errors) {
                    for (let e in res.data.errors) {
                        alert.error(res.data.errors[e]);
                    }
                } else {
                    alert.success(res.data.message)
                    setTimeout(() => {
                        navigate("/admin/manage-team");
                    }, 1000)
                }
            });

    };

    const getMember = () => {
        axios
            .get(`/api/admin/team/${param.id}/edit`, { headers })
            .then((res) => {
                const d = res.data.member[0];
                setName(d.name);
                setHebName(d.heb_name);
                setEmail(d.email);
                setPhone(d.phone);
                setAddress(d.address);
                setStatus(d.status);
                setPermission(d.role);
                if (d.color) {
                    let clr = document.querySelectorAll('input[name="swatch_demo"]');
                    clr.forEach((e, i) => {
                        e.getAttribute('color') == d.color
                            ? e.checked = true
                            : ''
                    })
                }
            })
    };
    useEffect(() => {
        getMember();
    }, []);
    return (
        <div id='container'>
            <Sidebar />
            <div id='content'>
                <h1 className="page-title">Edit Team member</h1>
                <div className='row'>
                    <div className='col-sm-6'>
                        <div className='dashBox p-4'>
                            <div className='form-group'>
                                <label className='control-label'>Name</label>
                                <input type='text' className='form-control' onChange={(e) => setName(e.target.value)} value={name} placeholder='Name' />
                            </div>
                            <div className='form-group'>
                                <label className='control-label'>Name in hebrew</label>
                                <input type='text' className='form-control' onChange={(e) => setHebName(e.target.value)} value={hebname} placeholder='Hebrew Name' />
                            </div>
                            <div className='form-group'>
                                <label className='control-label'>Email</label>
                                <input type='email' className='form-control' onChange={(e) => setEmail(e.target.value)} value={email} placeholder='Email' />
                            </div>
                            <div className='form-group'>
                                <label className='control-label'>Phone</label>
                                <input type='tel' className='form-control' onChange={(e) => setPhone(e.target.value)} value={phone} placeholder='Phone' />
                            </div>
                            <div className='form-group'>
                                <label className='control-label'>Address</label>
                                <input type='text' className='form-control' onChange={(e) => setAddress(e.target.value)} value={address} placeholder='Address' />
                            </div>
                        </div>
                    </div>
                    <div className='col-sm-6'>
                        <div className='dashBox p-4'>
                            <div className="form-group">
                                <div className="form-check form-check-inline1 pl-0" style={{ paddingLeft: "0" }}>
                                    <label class="form-check-label" for="title">Color</label>
                                </div>
                                <div className="swatch white">
                                    <input type="radio" name="swatch_demo" id="swatch_2" value="0" color="#fff" onChange={(e) => setColor('#fff')} />
                                    <label for="swatch_2"><i className="fa fa-check"></i></label>
                                    <span>white</span>
                                </div>
                                <div className="swatch green">
                                    <input type="radio" name="swatch_demo" id="swatch_2" value="2" color="#28a745" onChange={(e) => setColor('#28a745')} />
                                    <label for="swatch_2"><i className="fa fa-check"></i></label>
                                    <span>Green</span>
                                </div>
                                <div className="swatch blue">
                                    <input type="radio" name="swatch_demo" id="swatch_3" value="3" color="#007bff" onChange={(e) => setColor('#007bff')} />
                                    <label for="swatch_3"><i className="fa fa-check"></i></label>
                                    <span>Blue</span>
                                </div>
                                <div className="swatch purple">
                                    <input type="radio" name="swatch_demo" id="swatch_1" value="1" color="#6f42c1" onChange={(e) => setColor('#6f42c1')} />
                                    <label for="swatch_1"><i className="fa fa-check"></i></label>
                                    <span>Voilet</span>
                                </div>
                                <div className="swatch red">
                                    <input type="radio" name="swatch_demo" id="swatch_5" value="5" color="#dc3545" onChange={(e) => setColor('#dc3545')} />
                                    <label for="swatch_5"><i className="fa fa-check"></i></label>
                                    <span>Red</span>
                                </div>
                                <div className="swatch orange">
                                    <input type="radio" name="swatch_demo" id="swatch_4" value="4" color="#fd7e14" onChange={(e) => setColor('#fd7e14')} />
                                    <label for="swatch_4"><i className="fa fa-check"></i></label>
                                    <span>Orange</span>
                                </div>
                                <div className="swatch yellow">
                                    <input type="radio" name="swatch_demo" id="swatch_6" value="6" color="#ffc107" onChange={(e) => setColor('#ffc107')} />
                                    <label for="swatch_6"><i className="fa fa-check"></i></label>
                                    <span>Yellow</span>
                                </div>

                            </div>


                            <div className='form-group'>
                                <label className='control-label'>Password</label>
                                <input type='password' className='form-control' onChange={(e) => setPassword(e.target.value)} value={password} placeholder='Password' />
                            </div>
                            <div className='form-group'>
                                <label className='control-label'>Confirm Password</label>
                                <input type='password' className='form-control' onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} placeholder='Confirm Password' />
                            </div>
                            <div className='form-group'>
                                <label className='control-label'>Status</label>
                                <select className='form-control' onChange={(e) => setStatus(e.target.value)}>
                                    <option value={1} selected={status == 1} >Enable</option>
                                    <option value={0} selected={status == 0}>Disable</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className='col-sm-12'>
                        <div className='dashBox p-4 mt-3'>
                            <h4 className='mb-2'>Preset permissions</h4>
                            <div className='form-group'>
                                {
                                    permission == 'member'
                                        ? <input type='radio' value='member' name='role' checked style={{ height: "unset" }} />
                                        : <input type='radio' value='member' name='role' style={{ height: "unset" }} />
                                } Make Member &nbsp;

                                {
                                    permission == 'admin'
                                        ? <input type='radio' value='admin' name='role' checked style={{ height: "unset" }} />
                                        : <input type='radio' value='admin' name='role' style={{ height: "unset" }} />
                                } Make Administrator
                            </div>
                            <div className='form-group'>
                                <input type="submit" onClick={handleUpdate} class="btn btn-pink saveBtn" value="SAVE" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

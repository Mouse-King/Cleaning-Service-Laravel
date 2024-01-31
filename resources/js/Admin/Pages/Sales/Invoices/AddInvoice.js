import React, { useState, useEffect } from 'react';
import Sidebar from "../../../Layouts/Sidebar";
import { Link } from "react-router-dom";
import axios from 'axios';
import Moment from 'moment';
import { useAlert } from 'react-alert';
import { useNavigate } from "react-router-dom";
import Select from 'react-select';
import { SelectPicker } from 'rsuite';
import swal from 'sweetalert';
import { error } from 'jquery';

export default function AddInvoce() {

    const [amount, setAmount] = useState(0);
    const [dueDate, setDueDate] = useState();
    const [customer, setCustomer] = useState();
    const [selectedJobs, setSelectedJobs] = useState(null);
    const [job,setJob] = useState();
    const [lng, setLng] = useState();

    const queryParams = new URLSearchParams(window.location.search);
    const jid = queryParams.get("j");
    const cid = queryParams.get('c');

    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };

    const [clients, setClients] = useState();
    const [cjobs, setCjobs] = useState();
    const [jservices, setjServices] = useState([]);

    const [corders, setCOrders] = useState();
    const [codes,setCodes] = useState();

    const alert = useAlert();
    const navigate = useNavigate();

    const getCustomers = () => {
        axios
            .get(`/api/admin/all-clients`, { headers })
            .then((res) => {
                setClients(res.data.clients);
            });
    }


    const clientOrders = (cid) => {
        setCOrders([]);
        axios
            .post(`/api/admin/get-client-invorders`, { cid }, { headers })
            .then((res) => {
                let jar = [];
                const j = res.data.orders;


                if (j.length > 0) {
                    for (let i in j) {
                        let n = Moment(j[i].start_date).format('DD - MMM') + " | #" + j[i].order_id;
                        jar.push(
                            { value: j[i].id, label: n },
                        );
                    }
                    setCOrders(jar);
                }

            })
    }

    function onlyUnique(value, index, array) {
        return array.indexOf(value) === index;
    }

    const getJobs = (cid) => {
        setCjobs([]);
        axios
            .post(`/api/admin/invoice-jobs-order`, { cid }, { headers })
            .then((res) => {
                setCjobs(res.data.jobs);
            });
    }


    const getServices = (sel) => {

        let r_code = [];
        sel && sel.map((s, i) => {
            r_code.push(s.value);
        })
        let codes = r_code.filter(onlyUnique);
        setCodes(codes);
        let total = 0;
        axios
            .post(`/api/admin/get-codes-order`, { codes }, { headers })
            .then((res) => {
                let resp = res.data.services;
                if (resp.length > 0) {
                    for (let r in resp) {
                        total += parseFloat(resp[r].unitprice);
                    }
                }
                setAmount(total);
                setjServices(resp);
            })
    }



    const curr = (v) => {
        let c = (v).toLocaleString('en-US', {
            style: 'currency',
            currency: 'ILS',
        });
        return c;
    }


    const handleSubmit = (e) => {
        e.preventDefault();

        if (lng == undefined) { window.alert('client language is not set!'); return; }

        if (customer == null) { alert.error('Please select customer'); return; }
        if (jservices == null) { alert.error('Please select job'); return; }
        let type = $('.doc').val();
        if (type == 0) { alert.error('Please select document type'); return; }


        const data = {
            customer: customer,
            job:job,
            codes:codes,
            doctype:type,
            services: (JSON.stringify(jservices)),
            due_date: (dueDate != undefined) ? dueDate : '',
            amount: amount,
            status: (type == 'invrec') ? 'Paid' : 'Unpaid'

        }

        axios.post(`/api/admin/add-invoice`, { data }, { headers })
            .then((res) => {
               
                if(res.data.rescode != 401){
                alert.success('Invoice created successfully');
                setTimeout(() => {
                    navigate('/admin/invoices');
                }, 1000);

            } else{
                swal(res.data.msg,'','error');
            }

            })

    }
    const cData = clients && clients.map((c, i) => {
        return { value: c.id, label: (c.firstname + ' ' + c.lastname) };
    });

    const fetchLng = (cus) => {
        axios.get(`/api/admin/clients/${cus}`, { headers }).then((res) => { setLng(res.data.client.lng) });
    }
    useEffect(() => {
        getCustomers();

        if(jid != null && cid != null){

            getJobs(cid);
            setJob(jid);
            clientOrders(jid);
    
            setCustomer(cid);
            fetchLng(cid);
        }
      
    }, []);
    console.log(cjobs);
    return (
        <div id="container">
            <Sidebar />
            <div id="content">
                <div className="edit-customer">
                    <h1 className="page-title addEmployer">Create Invoice</h1>
                    <div className="card card-body">
                        <form>
                            <div className="row">
                                <div className="col-sm-12">

                                <div className="form-group">
                                        <label className="control-label">
                                            Document Type
                                        </label>
                                        <select className='form-control doc'>
                                            <option value={0}>-- select document --</option>
                                            <option value="invoice">Invoice</option>
                                            <option value="invrec">Invoice Receipt( Payment deduct from save card )</option>
                                        </select>

                                    </div>

                                    <div className="form-group">
                                        <label className="control-label">
                                            Customer
                                        </label>
                                        <SelectPicker data={cData}  defaultValue={ parseInt(cid) }  onChange={(value, event) => {setCustomer(value);getJobs(value);fetchLng(value)}} size="lg" required />
                                    </div>

                                    <div className="form-group">
                                        <label className="control-label">
                                            Job
                                        </label>
                                        <select className='form-control' onChange={(e) => {setJob(e.target.value);clientOrders(e.target.value);}}>
                                            <option value={0}>-- Select Job --</option>
                                            {
                                                cjobs && cjobs.map((j, i) => {
                                                    return (<option   value={j.id} selected = {j.id == parseInt(jid) }> {j.start_date + " | " + j.shifts+" | "+j.service_name}</option>)
                                                })
                                            }
                                        </select>


                                    </div>


                                    <div className="form-group">
                                        <label className="control-label">
                                            Orders
                                        </label>
                                        <Select
                                            isMulti
                                            name="colors"
                                            options={corders}
                                            className="basic-multi-single"
                                            isClearable={true}
                                            value={selectedJobs}
                                            classNamePrefix="select"
                                            onChange={(e) => { setSelectedJobs(e); getServices(e); }}
                                        />

                                    </div>
                                </div>

                                {jservices.length > 0 && <div className="row col-sm-12" style={{ "margin": "3px" }}>
                                    <table className='table table-bordered'>
                                        <thead>
                                            <tr>
                                                <th colspan="2">Details</th>
                                                <th>unitprice</th>
                                                <th>quantity</th>
                                                <th>Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {
                                                jservices && jservices.map((js, i) => {

                                                    return (
                                                        <>
                                                            <tr>
                                                                <td colspan="2">{js.description}</td>
                                                                <td>{curr(js.unitprice)}</td>
                                                                <td>{js.quantity}</td>
                                                                <td>{curr(js.unitprice)}</td>
                                                            </tr>


                                                        </>
                                                    )
                                                })

                                            }

                                        </tbody>
                                    </table>
                                </div>
                                }

                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <label className="control-label">
                                            Due Date &nbsp;
                                            <small color="red">( Default end of month )</small>
                                        </label>
                                        <input
                                            type="date"
                                            onChange={(e) =>
                                                setDueDate(e.target.value)
                                            }
                                            name="dueDate"
                                            className="form-control"
                                            placeholder="Enter cycle count"
                                            required
                                        />

                                    </div>
                                </div>


                                {amount != 0 && <div className="col-sm-12">
                                    <div className="form-group text-center">

                                        <h5>Total Amount : <span className="total">{curr(amount)}</span></h5>

                                    </div>
                                </div>
                                }



                                <div className="form-group text-center col-sm-12">
                                    <input
                                        type="submit"
                                        value="Generate Document"
                                        onClick={handleSubmit}
                                        className="btn btn-success saveBtn"
                                        disabled={amount == 0}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
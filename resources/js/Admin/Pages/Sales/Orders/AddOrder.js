import React, { useState, useEffect } from 'react';
import Sidebar from "../../../Layouts/Sidebar";
import { Link } from "react-router-dom";
import axios from 'axios';
import Moment from 'moment';
import { useAlert } from 'react-alert';
import { useNavigate } from "react-router-dom";
import Select from 'react-select';
import { SelectPicker } from 'rsuite';

export default function AddOrder() {

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
            .post(`/api/admin/invoice-jobs`, { cid }, { headers })
            .then((res) => {
                setCjobs(res.data.jobs);
            });
    }


    const getServices = (sel) => {

       
        // let r_code = [];
        // sel && sel.map((s, i) => {
        //     r_code.push(s.value);
        // })
        // let codes = r_code.filter(onlyUnique);

        axios
            .post(`/api/admin/order-jobs`, { id:sel }, { headers })
            .then((res) => {
                
                let resp = res.data.services[0].jobservice;
                let lng = res.data.services[0].client.lng;

                if (resp.length > 0) {
                    
                    setjServices(resp);
                    setTimeout(() => {
                        let st = 0;
                        for (let r in resp) {

                            let d = Moment(res.data.services[r].start_date).format('DD MMM, Y');
                          
                            (lng == 'heb') ?
                            $('.details' + r).val(resp[r].heb_name+" - "+d)
                            :$('.details' + r).val(resp[r].name+" - "+d);

                            $('.quantity' + r).val(1);
                            $('.price' + r).val(resp[r].total);
                            $('.rtotal' + r).val(resp[r].total);

                            st += parseFloat(resp[r].total);
                        }
                        setAmount(st);
                     
                    }, 200);
                }

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
        const ser = [{
           description:$('.details0').val(),
           unitprice:$('.price0').val(),
           quantity:$('.quantity0').val()
        }];
        
        const data = {
            customer: customer,
            job:job,
            doctype:'order',
            services: (JSON.stringify(ser)),
            due_date: (dueDate != undefined) ? dueDate : '',
            amount: amount,
            status: 'Open'

        }

        axios.post(`/api/admin/add-order`, { data }, { headers })
            .then((res) => {
                alert.success('Order created successfully');
                setTimeout(() => {
                    navigate('/admin/orders');
                }, 1000);
            })

    }

    const changePrice = (e) =>{
        let v = e.target.value;
        setAmount(curr(v));
        $('.price0').val(v);
        $('.rtotal0').val(v);
    }
   
    const cData = clients && clients.map((c, i) => {
        return { value: c.id, label: (c.firstname + ' ' + c.lastname) };
    });


    useEffect(() => {
        getCustomers();
        

        if(jid != null && cid != null){

        getJobs(cid);
        setJob(jid);
        getServices(jid);

        setCustomer(cid);
        }


        setTimeout(() => {
            const cus = $('.cus').val();
            axios.get(`/api/admin/clients/${1}`, { headers }).then((res) => { setLng(res.data.client.lng) });
        }, 1000);
    }, []);

    return (
        <div id="container">
            <Sidebar />
            <div id="content">
                <div className="edit-customer">
                    <h1 className="page-title addEmployer">Create Order</h1>
                    <div className="card card-body">
                        <form>
                            <div className="row">
                                <div className="col-sm-12">

                            
                                    <div className="form-group">
                                        <label className="control-label">
                                            Customer
                                        </label>
                                        <SelectPicker data={cData} defaultValue={ parseInt(cid) } onChange={(value, event) => {setCustomer(value);getJobs(value);}} size="lg" required />
                                    </div>

                                    <div className="form-group">
                                        <label className="control-label">
                                            Job
                                        </label>
                                        <select className='form-control' onChange={(e) => {setJob(e.target.value);getServices(e.target.value);}}>
                                            <option value={0}>-- Select Job --</option>
                                            {
                                                cjobs && cjobs.map((j, i) => {
                                                    return (<option selected = {j.id == parseInt(jid) } value={j.id} > {j.start_date + " | " + j.shifts+" | "+j.service_name}</option>)
                                                })
                                            }
                                        </select>


                                    </div>

                                </div>

                                {
                                        jservices && jservices.map((js, i) => {

                                            return (
                                                <>

                                                    <div className="row col-sm-12" style={{ "margin": "3px" }}>

                                                        <div className=''>
                                                            <span className="hpoint">&#9755;</span>
                                                        </div>

                                                        <div className='col-sm-3'>
                                                            <div className="form-group">
                                                                <label className="control-label">
                                                                    Details
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="details"
                                                                    className={`form-control details`+i}
                                                                    placeholder="Service"
                                                                    required
                                                                />

                                                            </div>
                                                        </div>
                                                     
                                            
                                                        <div className='col-sm-2'>
                                                            <div className="form-group">
                                                                <label className="control-label">
                                                                   Unit Price
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    name="unitprice"
                                                                    onChange={(e) => changePrice(e)}
                                                                    className={`form-control price` + i}
                                                                    placeholder="Unit Price"
                                                                    required
                                                                />

                                                            </div>
                                                        </div>

                                                        <div className='col-sm-3'>
                                                            <div className="form-group">
                                                                <label className="control-label">
                                                                 quantity
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    name="quantity"
                                                                    className={`form-control quantity` + i}
                                                                    placeholder="quantity"
                                                                    required
                                                                />

                                                            </div>
                                                        </div>

                                                        <div className='col-sm-3'>
                                                            <div className="form-group">
                                                                <label className="control-label">
                                                                 Total
                                                                </label>
                                                                <input
                                                                    type="number"
                                                                    name="rtotal"
                                                                    onChange={(e) => changePrice(e)}
                                                                    className={`form-control rtotal` + i}
                                                                    placeholder="Total"
                                                                    required
                                                                />

                                                            </div>
                                                        </div>

                                                    </div>
                                                </>
                                            )
                                        })

                                    }

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
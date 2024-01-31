import React, { useState, useEffect } from "react";
import Sidebar from "../../../Layouts/Sidebar";
import ReactPaginate from "react-paginate";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import { Link } from "react-router-dom";
import axios from "axios";
import Moment from 'moment';
import { Base64 } from "js-base64";
import Swal from "sweetalert2";

import { render } from "react-dom";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

export default function Invoices() {

    const [loading, setLoading] = useState("Loading...");
    const [invoices, setInvoices] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [bt, setBt] = useState(true);
    const [ch, setCh] = useState(false);
    const [cancelDoc,setCancelDoc] = useState('');
    const [dtype,setDtype] = useState('');
    const [reason,setReason] = useState('');
    const [cbvalue,setCbvalue] = useState('');
    const [res,setRes]         = useState('');
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };

    const [payId, setPayID] = useState(0);
    const [place,setPlace]   = useState('');
    const [paidAmount, setPaidAmount] = useState('');
    const [amount, setAmount] = useState();
    const [txn, setTxn] = useState('');
    const [filtered,setFiltered] = useState('');

    const getInvoices = () => {
        axios
            .get('/api/admin/invoices', { headers })
            .then((res) => {
                setRes(res.data);
                if (res.data.invoices.data.length > 0) {
                    setInvoices(res.data.invoices.data);
                    setPageCount(res.data.invoices.last_page);
                } else {
                    setInvoices([]);
                    setLoading('No Invoice found');
                }
            })
    }

    const copy = [...invoices];
    const [order, setOrder] = useState('ASC');
    const sortTable = (e, col) => {

        let n = e.target.nodeName;
        if (n != "SELECT") {
            if (n == "TH") {
                let q = e.target.querySelector('span');
                if (q.innerHTML === "↑") {
                    q.innerHTML = "↓";
                } else {
                    q.innerHTML = "↑";
                }

            } else {
                let q = e.target;
                if (q.innerHTML === "↑") {
                    q.innerHTML = "↓";
                } else {
                    q.innerHTML = "↑";
                }
            }
        }

        if (order == 'ASC') {
            const sortData = [...copy].sort((a, b) => (a[col] < b[col] ? 1 : -1));
            setInvoices(sortData);
            setOrder('DESC');
        }
        if (order == 'DESC') {
            const sortData = [...copy].sort((a, b) => (a[col] < b[col] ? -1 : 1));
            setInvoices(sortData);
            setOrder('ASC');
        }

    }

    const handlePageClick = async (data) => {
        let currentPage = data.selected + 1;
        axios
            .get("/api/admin/invoices?page=" + currentPage+"&"+filtered, { headers })
            .then((response) => {
                if (response.data.invoices.data.length > 0) {
                    setInvoices(response.data.invoices.data);
                    setPageCount(response.data.invoices.last_page);
                } else {
                    setLoading("No Invoice Found");
                }
            });
    };

    const handlePayment = () => {
        if (paidAmount == '') { window.alert('Please enter amount'); return; }

        const m = document.querySelector('.mode').value;


        const stat = ((paidAmount) >= (amount)) ? 'Paid' : 'Partially Paid';
        const pm = {
            'cc': 'Credit Card',
            'mt': 'Bank Transfer',
            'cash': 'Cash',
            'cheque': 'Cheque'
        }
        const mdata = {
            'paid_amount': paidAmount,
            'pay_method': paidAmount > 0 ? pm[m] : '',
            'txn_id': txn,
            'status': paidAmount > 0 ? stat : 'Unpaid',
        }
        let data = {};

        if (m == 'mt') {
            const btd = document.querySelector('.btd').value;
            const ba = document.querySelector('.ba').value;
            if(btd == ''){ window.alert('Please select bank transfer date'); return;}
            if(ba == ''){ window.alert('please enter bank account'); return;}
            data = {
               ...mdata,
               'date':btd,
               'account':ba
            }

        } else if (m == 'cheque') {

            const cd = document.querySelector('.cd').value;
            const cbk = document.querySelector('.cbk').value;
            const cb = document.querySelector('.cb').value;
            const ca = document.querySelector('.ca').value;
            const cno = document.querySelector('.cno').value;
            if(cd == ''){ window.alert('please select cheque date'); return;}
            if(cbk == ''){ window.alert('please enter cheque bank'); return;}
            if(cb == ''){ window.alert('please enter cheque branch'); return;}
            if(ca == ''){ window.alert('please enter cheque account'); return;}
            if(cno == ''){ window.alert('please enter cheque number'); return;}

            data = {
                ...mdata,
                'date':cd,
                'bank':cbk,
                'branch':cb,
                'account':ca,
                'number':cno,
             }


        } else {
            data = {...mdata};
        }

        let sb = $('.sbtn').prop('disabled',true);
        sb.html('Please wait..');
        axios.post(`/api/admin/update-invoice/${payId}`, { data }, { headers })
            .then((res) => {
               
                if(res.data.rescode != undefined && res.data.rescode == 401){

                    window.alert(res.data.msg);
                    sb.prop('disabled',false);
                    sb.html('Save Payment');
                    return;
                }
                document.querySelector('.closeb1').click();
                sb.prop('disabled',false);
                sb.html('Save Payment');
                getInvoices('');
                setPaidAmount('');
                setPayID(0);

            })

    }


    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Delete Invoice!",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .get(`/api/admin/delete-invoice/${id}`, { headers })
                    .then((response) => {
                        Swal.fire(
                            "Deleted!",
                            "Invoice has been deleted.",
                            "success"
                        );
                        setTimeout(() => {
                            getInvoices();
                        }, 1000);
                    });
            }
        });
    };

    const closeDoc = (id, type) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Close Invoice!",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .get(`/api/admin/close-doc/${id}/${type}`, { headers })
                    .then((response) => {
                        Swal.fire(
                            "Closed",
                            response.data.msg,
                            "success"
                        );
                        setTimeout(() => {
                            getInvoices();
                        }, 1000);
                    });
            }
        });
    };

    const handleCancel = (e) => {

        e.preventDefault();
        const data = {
            "doctype":dtype,
            "docnum" :cancelDoc,
            "reason" :reason
        }
       
      axios
      .post(`/api/admin/cancel-doc`,{ data },{ headers })
      .then((res)=>{
        $(".closeb11").click();
        Swal.fire(res.data.msg,"","info");
        getInvoices();
      })
    }

    const filter = (e) => {
        e.preventDefault();
        let fils = document.querySelectorAll('.filter');
        let d = '';
        fils.forEach((el, i) => {
            if (el.value !== 'Please Select')
                d += el.name + "=" + el.value + "&";

        })
        setFiltered(d);
        axios
            .get(`/api/admin/invoices?${d}`, { headers })
            .then((res) => {
                if (res.data.invoices.data.length > 0) {
                    setInvoices(res.data.invoices.data);
                    setPageCount(res.data.invoices.last_page);
                } else {
                    setInvoices([]);
                    setLoading('No Invoice Found');
                }
            })
    }

    const dfilter = (fil) => {

        setFiltered(fil);

        axios
            .get(`/api/admin/invoices?${fil}`, { headers })
            .then((res) => {
                if (res.data.invoices.data.length > 0) {
                    setInvoices(res.data.invoices.data);
                    setPageCount(res.data.invoices.last_page);
                } else {
                    setInvoices([]);
                    setLoading('No Invoice Found');
                }
            })
    }



    const handleMethod = (e) => {
        let v = e.target.value;
        if (v == 'mt') {
            setBt(true);
            setCh(false);
        }
        else if (v == 'cheque') {
            setBt(false);
            setCh(true);
        } else {
            setBt(false);
            setCh(false);
        }

    }

    const displayCallback = (cb) =>{
        $('.ace-tm').css({'background-color':'black','color':'#5cc527'});

        let c = (cb) ? JSON.parse(cb) : cb;
        setCbvalue(cb);
    }

    useEffect(() => {
        getInvoices();
    }, []);
    return (
        <div id="container">
            <Sidebar />
            <div id="content">
                <div className="titleBox customer-title">
                    <div className="row">
                        <div className="col-sm-6">
                            <h1 className="page-title">Manage Invoices</h1>
                        </div>
                        <div className="col-sm-6">
                            <Link
                                to="/admin/add-invoice"
                                className="ml-2 btn btn-pink addButton">
                                <i className="btn-icon fas fa-plus-circle"></i>
                                Create Invoice
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="sales-filter">
                    <div className="row">
                        <div className="col-sm-3 col-6">
                            <div className="form-group">
                                <label className="control-label">From Date</label>
                                <input type="date" name="from_date" className="form-control filter" />
                            </div>
                        </div>
                        <div className="col-sm-3 col-6">
                            <div className="form-group">
                                <label className="control-label">To Date</label>
                                <input type="date" name="to_date" className="form-control filter" />
                            </div>
                        </div>
                        <div className="col-sm-3 col-6">
                            <div className="form-group">
                                <label className="control-label">Invoice ID</label>
                                <input type="text" className="form-control filter" name="invoice_id" placeholder="Invoice ID" />
                            </div>
                        </div>
                        <div className="col-sm-3 col-6">
                            <div className="form-group">
                                <label className="control-label">Customer</label>
                                <input type="text" className="form-control filter" name="client" placeholder="Customer" />
                            </div>
                        </div>
                        <div className="col-sm-3 col-6">
                            <div className="form-group">
                                <label className="control-label">Transaction ID/Ref.</label>
                                <input type="text" className="form-control filter" name="txn_id" placeholder="Transaction ID/Ref." />
                            </div>
                        </div>
                        <div className="col-sm-3 col-6">
                            <div className="form-group">
                                <label className="control-label">Payment mode</label>
                                <select className="form-control filter" name="pay_method">
                                    <option>Please Select</option>
                                    <option value="Credit Card">Credit Card</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                    <option value="Cheque">By Cheque</option>
                                    <option value="Cash">By Cash</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-sm-2 col-6">
                            <div className="form-group">
                                <label className="control-label">Status</label>
                                <select className="form-control filter" name="status">
                                    <option>Please Select</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Unpaid">Unpaid</option>
                                    <option value="Partially paid">Partially paid</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>

                        <div className="col-sm-2 col-6">
                            <div className="form-group">
                                <label className="control-label">Invoice Type</label>
                                <select className="form-control filter" name="type">
                                    <option>Please Select</option>
                                    <option value="invoice">Invoice</option>
                                    <option value="invrec">Invoice Receipt</option>
                                    <option value="receipt">Receipt</option>
                                    <option value="refund">Refunded Invoice</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-sm-2 col-6">
                            <label className="control-label d-block">&nbsp;</label>
                            <button className="btn btn-pink" onClick={e => filter(e)} style={{ minWidth: "100px" }}>Filter</button>
                        </div>
                    </div>
                </div>

                <div className="InCards container mb-3" style={{ cursor: 'pointer' }}>
                    <div className="row">

                        <div onClick={(e) => { setFiltered('f=all'); dfilter('f=all') }} className="col-sm-2 bg-secondary p-1 m-1 text-white rounded text-center">
                            <div className="card-body">
                                <p className="lead">{res.all} - Total</p><hr />
                                <p className="lead"> {res.ta} ILS</p>
                            </div>
                        </div>

                        <div onClick={(e) => { setFiltered('status=Paid'); dfilter('status=Paid') }} className="col-sm-3 bg-success p-1 m-1 text-white rounded text-center">
                            <div className="card-body">
                                <p className="lead">{res.paid} - Paid</p><hr />
                                <p className="lead"> {res.pa} ILS</p>
                            </div>
                        </div>

                        <div onClick={(e) => { setFiltered('status=Unpaid'); dfilter('status=Unpaid') }} className="col-sm-3 bg-dark p-1 m-1 text-white rounded text-center">
                            <div className="card-body">
                                <p className="lead">{res.unpaid} - Unpaid</p><hr />
                                <p className="lead"> {res.ua} ILS</p>
                            </div>
                        </div>

                        <div onClick={(e) => { setFiltered('status=Partially Paid'); dfilter('status=Partially Paid') }} className="col-sm-3 bg-warning p-1 m-1 text-white rounded text-center">
                            <div className="card-body">
                                <p className="lead">{res.partial} - Partial Paid</p><hr />
                                <p className="lead">{res.ppa} ILS</p>
                            </div>
                        </div>




                    </div>
                </div>


                <div className="card">
                    <div className="card-body">
                        <div className="boxPanel">
                            <div className="table-responsive">
                                {invoices.length > 0 ? (
                                    <Table className="table table-bordered">
                                        <Thead>
                                            <Tr>
                                                <Th scope="col" style={{ cursor: "pointer" }} onClick={(e) => { sortTable(e, 'id') }}  >    #Invoice ID     <span className="arr"> &darr;</span></Th>
                                                <Th scope="col" style={{ cursor: "pointer" }} onClick={(e) => { sortTable(e, 'amount') }}  >Total Amount       <span className="arr"> &darr;</span></Th>
                                                <Th scope="col" style={{ cursor: "pointer" }} onClick={(e) => { sortTable(e, 'amount') }}  >Paid Amount       <span className="arr"> &darr;</span></Th>
                                                <Th scope="col" style={{ cursor: "pointer" }} onClick={(e) => { sortTable(e, 'created_at') }}  >Created Date      <span className="arr"> &darr;</span></Th>
                                                <Th scope="col" style={{ cursor: "pointer" }} onClick={(e) => { sortTable(e, 'due_date') }} >Due Date          <span className="arr"> &darr;</span></Th>
                                                <Th scope="col"  >Customer   </Th>
                                                <Th scope="col" style={{ cursor: "pointer" }} onClick={(e) => { sortTable(e, 'status') }}  >Status            <span className="arr"> &darr;</span></Th>
                                                <Th scope="col" style={{ cursor: "pointer" }} onClick={(e) => { sortTable(e, 'status') }}  >Doc Status        <span className="arr"> &darr;</span></Th>
                                                <Th scope="col"  >Transaction ID/Ref.</Th>
                                                <Th scope="col"  >Payment Mode</Th>
                                                <Th scope="col">Action</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {invoices &&
                                                invoices.map((item, index) => {
                                                    
                                                    let services = (item.services != undefined && item.services != null) ? JSON.parse(item.services) : [];
                                                    
                                                    let pl = item.amount != item.paid_amount ?  parseFloat(item.amount)-parseFloat(item.paid_amount) : item.amount;
                                                    pl = "Total Payable -  "+pl+" ILS";

                                                    return (
                                                        <Tr>
                                                            <Td>#{item.invoice_id}</Td>
                                                            <Td>{item.amount} ILS</Td>
                                                            <Td>{item.paid_amount} ILS</Td>
                                                            <Td>{Moment(item.created_at).format('DD, MMM Y')}</Td>
                                                            <Td>{(item.due_date != null) ? Moment(item.due_date).format('DD, MMM Y') : 'NA'}</Td>
                                                            <Td><Link to={`/admin/view-client/${ (item.client) ?item.client.id : 'NA'}`}>{ (item.client) ?item.client.firstname + " " + item.client.lastname : 'NA'}</Link></Td>
                                                            <Td onClick={ e => displayCallback(item.callback) } style={{cursor:'pointer'}} data-toggle="modal" data-target="#callBack">
                                                                <a href="#">{item.status}</a>
                                                            </Td>
                                                            <Td>
                                                                {item.invoice_icount_status}
                                                            </Td>
                                                            <Td>
                                                                {item.txn_id ? item.txn_id : 'NA'}
                                                            </Td>
                                                            <Td>
                                                                {item.pay_method ? item.pay_method : 'Credit Card'}
                                                            </Td>
                                                            <Td>
                                                                <div className="action-dropdown dropdown">
                                                                    <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown">
                                                                        <i className="fa fa-ellipsis-vertical"></i>
                                                                    </button>

                                                                    <div className="dropdown-menu">
                                                                        <a target="_blank" href={item.doc_url} className="dropdown-item">View Invoice</a>
                                                                        {
                                                                            item.status != 'Paid' && <button onClick={(e) => { setPayID(item.id); setPlace(pl); setAmount(item.amount) }} data-toggle="modal" data-target="#exampleModaPaymentAdd" className="dropdown-item"
                                                                            >Add Payment</button>
                                                                        }

                                                                        {
                                                                            item.invoice_icount_status == 'Open' && <button onClick={(e) => { closeDoc(item.invoice_id, item.type) }} className="dropdown-item"
                                                                            >Close Doc</button>
                                                                        }
                                                                        { item.invoice_icount_status != 'Cancelled' && item.invoice_icount_status != 'Closed' && <button onClick= {(e)=>{setCancelDoc(item.invoice_id);setDtype(item.type)} } data-toggle="modal" data-target="#exampleModalCancel" className="dropdown-item"
                                                                            >Cancel Doc</button>
                                                                        }
                                                                        {
                                                                            item.receipt &&  <a target="_blank" href={item.receipt.docurl} className="dropdown-item">View Receipt</a>
                                                                        }
                                                                       {/* <button onClick={e => handleDelete(item.id)} className="dropdown-item"
                                                                        >Delete</button>*/}
                                                                    </div>
                                                                </div>
                                                            </Td>
                                                        </Tr>
                                                    )
                                                })}
                                        </Tbody>
                                    </Table>)
                                    : (
                                        <div className="form-control text-center"> No Invoice Found</div>
                                    )}

                                {invoices.length > 0 ? (
                                    <ReactPaginate
                                        previousLabel={"Previous"}
                                        nextLabel={"Next"}
                                        breakLabel={"..."}
                                        pageCount={pageCount}
                                        marginPagesDisplayed={2}
                                        pageRangeDisplayed={3}
                                        onPageChange={handlePageClick}
                                        containerClassName={
                                            "pagination justify-content-end mt-3"
                                        }
                                        pageClassName={"page-item"}
                                        pageLinkClassName={"page-link"}
                                        previousClassName={"page-item"}
                                        previousLinkClassName={"page-link"}
                                        nextClassName={"page-item"}
                                        nextLinkClassName={"page-link"}
                                        breakClassName={"page-item"}
                                        breakLinkClassName={"page-link"}
                                        activeClassName={"active"}
                                    />
                                ) : ''}



                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="exampleModaPaymentAdd" tabindex="-1" role="dialog" aria-labelledby="exampleModaPaymentAdd" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModaPaymentAdd">Add Payment</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">

                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="form-group">
                                            <label className="control-label">
                                                Amount
                                            </label>
                                            <input
                                                type="text"
                                                value={paidAmount}
                                                onChange={(e) =>
                                                    setPaidAmount(e.target.value)
                                                }
                                                className="form-control"
                                                required
                                                placeholder={ place }
                                            ></input>

                                        </div>
                                    </div>

                                </div>

                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="form-group">
                                            <label className="control-label">
                                                Transaction / Refrence ID
                                                <small> ( Optional in credit card mode )</small>
                                            </label>
                                            <input
                                                type="text"
                                                value={txn}
                                                onChange={(e) =>
                                                    setTxn(e.target.value)
                                                }
                                                className="form-control"
                                                required
                                                placeholder="Enter Transaction / Refrence ID"
                                            ></input>

                                        </div>
                                    </div>

                                </div>

                                <div className="row">
                                    <div className="col-sm-12">
                                        <div className="form-group">
                                            <label className="control-label">
                                                Payment Mode
                                            </label>
                                            <select name='mode' className='form-control mode' onChange={e => handleMethod(e)} >
                                                <option value='mt'    >Bank Transfer</option>
                                                <option value='cash' >By Cash</option>
                                                <option value='cc'     >Credit Card</option>
                                                <option value='cheque' >By Cheque</option>
                                            </select>

                                        </div>
                                    </div>

                                </div>
                                {bt == true &&
                                    <div>
                                        <div className="row">
                                            <div className="col-sm-12">
                                                <div className="form-group">
                                                    <label className="control-label">
                                                        Bank Transfer Date
                                                    </label>
                                                    <input
                                                        type="date"
                                                        className="form-control btd"
                                                        required
                                                    ></input>

                                                </div>
                                            </div>

                                        </div>

                                        <div className="row">
                                            <div className="col-sm-12">
                                                <div className="form-group">
                                                    <label className="control-label">
                                                        Account
                                                    </label>
                                                    <input
                                                        type="number"
                                                        className="form-control ba"
                                                        placeholder="Bank account ID where BankTransfer was deposited"
                                                        required
                                                    ></input>

                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                }

                                {ch == true &&
                                    <div>

                                        <div className="row">
                                            <div className="col-sm-12">
                                                <div className="form-group">
                                                    <label className="control-label">
                                                        Cheque Date
                                                    </label>
                                                    <input
                                                        type="date"
                                                        className="form-control cd"
                                                        required
                                                    ></input>

                                                </div>
                                            </div>

                                        </div>

                                        <div className="row">
                                            <div className="col-sm-12">
                                                <div className="form-group">
                                                    <label className="control-label">
                                                        Cheque Bank
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control cbk"
                                                        required
                                                        placeholder="Cheque Bank"
                                                    ></input>

                                                </div>
                                            </div>

                                        </div>

                                        <div className="row">
                                            <div className="col-sm-12">
                                                <div className="form-group">
                                                    <label className="control-label">
                                                        Cheque Branch
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control cb"
                                                        required
                                                        placeholder="Cheque Branch"
                                                    ></input>

                                                </div>
                                            </div>

                                        </div>

                                        <div className="row">
                                            <div className="col-sm-12">
                                                <div className="form-group">
                                                    <label className="control-label">
                                                        Cheque account
                                                    </label>
                                                    <input
                                                        type="number"
                                                        className="form-control ca"
                                                        required
                                                        placeholder="Cheque account"
                                                    ></input>

                                                </div>
                                            </div>

                                        </div>

                                        <div className="row">
                                            <div className="col-sm-12">
                                                <div className="form-group">
                                                    <label className="control-label">
                                                        Cheque number
                                                    </label>
                                                    <input
                                                        type="number"
                                                        className="form-control cno"
                                                        required
                                                        placeholder="Cheque number"
                                                    ></input>

                                                </div>
                                            </div>

                                        </div>


                                    </div>
                                }





                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary closeb1" data-dismiss="modal">Close</button>
                                <button type="button" onClick={handlePayment} className="btn btn-primary sbtn">Save Payment</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div className="modal fade" id="exampleModalCancel" tabindex="-1" role="dialog" aria-labelledby="exampleModalCancel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalCancel">Cancel Reason</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">

                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="form-group">
                                       
                                        <textarea
                                                onChange={(e) =>
                                                    setReason(e.target.value)
                                                }
                                            className="form-control"
                                            required
                                            placeholder="Enter Reason(optional)"
                                        ></textarea>

                                    </div>
                                </div>
                                    
                            </div>

                            
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary closeb11" data-dismiss="modal">Close</button>
                            <button type="button" onClick={e=>handleCancel(e)} className="btn btn-primary sbtn1">Cancel Doc</button>
                        </div>
                    </div>
                </div>
            </div>


            <div className="modal fade" id="callBack" tabindex="-1" role="dialog" aria-labelledby="callBack" aria-hidden="true">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="callBack">Payment Response</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">

                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="form-group">
                                       
                                    {<AceEditor
                                        mode="json"
                                        theme="twilight"
                                        width='100%'
                                        name="cbfield"
                                        fontSize="20px"
                                        showPrintMargin={false}
                                        value={cbvalue ? JSON.stringify(JSON.parse(cbvalue), null, 2) : ''}
                                        editorProps={{ $blockScrolling: true }}
                                        setOptions={{
                                            useWorker: false
                                          }}
                                        />}
                                        
                                    </div>
                                </div>
                                    
                            </div>

                            
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary closeb11" data-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    )
}
import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Moment from 'moment';
import { Base64 } from "js-base64";

export default function Order() {

    const [loading, setLoading] = useState("Loading...");
    const [pageCount, setPageCount] = useState(0);
    const [orders, setOrders]   = useState([]);
    const [res,setRes] = useState(''); 
    const [reason,setReason] = useState('');
    const [cancelDoc,setCancelDoc] = useState('');
    const [dtype,setDtype] = useState('');
    const [filtered,setFiltered] = useState('');
    const params = useParams();
    const id = params.id;
   
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };

    const getOrders = (filter) => {
        axios
            .get(`/api/admin/client-orders/${id}?`+filter, { headers })
            .then((res) => {
                setRes(res.data);
                if (res.data.orders.data.length > 0) {
                    setOrders(res.data.orders.data);
                    setPageCount(res.data.orders.last_page);
                } else {
                    setOrders([]);
                    setLoading('No Order Found');
                }
            })
    }

    
    const copy = [...orders];
    const [order,setOrder] = useState('ASC');
    const sortTable = (e,col) =>{
        
        let n = e.target.nodeName;
        if(n != "SELECT"){
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
 
        if(order == 'ASC'){
            const sortData = [...copy].sort((a, b) => (a[col] < b[col] ? 1 : -1));
            setOrders(sortData);
            setOrder('DESC');
        }
        if(order == 'DESC'){
            const sortData = [...copy].sort((a, b) => (a[col] < b[col] ? -1 : 1));
            setOrders(sortData);
            setOrder('ASC');
        }
        
    }

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Delete Order!",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .get(`/api/admin/delete-oders/${id}`, { headers })
                    .then((response) => {
                        Swal.fire(
                            "Deleted!",
                            "Order has been deleted.",
                            "success"
                        );
                        setTimeout(() => {
                            getOrders();
                        }, 1000);
                    });
            }
        });
    };

    const handlePageClick = async (data) => {
        let currentPage = data.selected + 1;
        axios
            .get(`/api/admin/client-orders/${id}?page=` + currentPage+"&"+filtered, { headers })
            .then((response) => {
                if (response.data.orders.data.length > 0) {
                    setOrders(response.data.orders.data);
                    setPageCount(response.data.orders.last_page);
                } else {
                    setLoading("No Order Found");
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
            confirmButtonText: "Yes, Close Order!",
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
                            getOrders('f=all');
                        }, 1000);
                    });
            }
        });
    };

    const GenInvoice = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You want to generate invoice for this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Generate Invoice!",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .get(`/api/admin/order-manual-invoice/${id}`, { headers })
                    .then((response) => {
                        Swal.fire(
                            "Invoice Generated",
                            response.data.msg,
                            "success"
                        );
                        setTimeout(() => {
                            getOrders('f=all');
                        }, 1000);
                    });
            }
        });
    }

   
    useEffect(() => {
        setFiltered('f=all');
        getOrders('f=all');
    }, []);
    return (
        <div className="boxPanel">
             <div className="action-dropdown dropdown order_drop text-right mb-3">
                  <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown">
                      <i className="fa fa-filter"></i>
                  </button>
                  <div className="dropdown-menu">
                  <button className="dropdown-item"  onClick={(e)=>{setFiltered('f=all');getOrders('f=all')}}                            >All          - { res.all }</button>
                      <button className="dropdown-item"  onClick={(e)=>{setFiltered('status=Open');getOrders('status=Open')}}            >Open         - { res.open }</button>
                      <button className="dropdown-item"  onClick={(e)=>{setFiltered('status=Closed');getOrders('status=Closed')}}        >Closed       - { res.closed }</button>
                      <button className="dropdown-item"  onClick={(e)=>{setFiltered('invoice_status=m');getOrders('invoice_status=m')}}  >Invoiced     - { res.generated }</button>
                      <button className="dropdown-item"  onClick={(e)=>{setFiltered('invoice_status=0');getOrders('invoice_status=0')}}  >Not Invoiced - { res.not_generated } </button>
                  </div>
            </div>
            <div className="table-responsive">
           
            { orders.length > 0 ?(
                <Table className="table table-bordered">
                    <Thead>
                        <Tr>
                            <Th scope="col" style={{ cursor: "pointer" }} onClick={(e)=>{sortTable(e,'id')}}  > #Order ID           <span className="arr"> &darr;</span></Th>
                            <Th scope="col" >Job </Th>
                            <Th scope="col" style={{ cursor: "pointer" }} onClick={(e)=>{sortTable(e,'created_at')}} >Created Date   <span className="arr"> &darr;</span></Th>
                            <Th scope="col"  >Customer   </Th>
                            <Th scope="col" style={{ cursor: "pointer" }}  onClick={(e)=>{sortTable(e,'status')}}>Status            <span className="arr"> &darr;</span></Th>
                            <Th scope="col">Invoice Status</Th>
                            <Th scope="col">Action</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {orders &&
                            orders.map((item, index) => {
                                let services = (item.items != undefined && item.items != null) ? JSON.parse(item.items) : []

                                return (
                                    <Tr>
                                        <Td>#{item.order_id}</Td>
                                        <Td><Link to={`/admin/view-job/${(item.job) ? item.job.id : 'NA'}`}>{ (item.job) ? Moment(item.job.start_date).format('DD-MM-Y')+ " | "+item.job.shifts : 'NA'  }</Link></Td>
                                        <Td>{ Moment(item.created_at).format('DD, MMM Y')}</Td>
                                        <Td><Link to={`/admin/view-client/${item.client ? item.client.id : 'NA' }`}>{(item.client) ? item.client.firstname + " " + item.client.lastname : 'NA'}</Link></Td>
                                        <Td>
                                            {item.status}
                                        </Td>
                                        <Td>
                                            { item.invoice_status == "2" ?  "Generated" : "Not Generated" }
                                        </Td>
                                        <Td>
                                            <div className="action-dropdown dropdown">
                                                <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown">
                                                    <i className="fa fa-ellipsis-vertical"></i>
                                                </button>
                                                <div className="dropdown-menu">
                                                {  item.status == 'Open' && <a target="_blank" href={item.doc_url} className="dropdown-item">View Order</a>}
                                                                         
                                                {
                                                    item.status == 'Open' && <button onClick={e => closeDoc(item.order_id, 'order')} className="dropdown-item"
                                                    >Close Doc</button>
                                                }
                                                {
                                                    item.status == 'Open' && <button onClick={e => GenInvoice(item.id)} className="dropdown-item"
                                                    >Generate Invoice</button>
                                                }
                                                { item.status != 'Cancelled' && <button onClick= {(e)=>{setCancelDoc(item.order_id);setDtype('order')} } data-toggle="modal" data-target="#exampleModal1" className="dropdown-item"
                                                    >Cancel Doc</button>
                                                }

                                                {/*<button  onClick={e=>handleDelete(item.id)} className="dropdown-item"
                                                    >Delete</button>*/}
                                                </div>
                                            </div>
                                        </Td>
                                    </Tr>
                                )
                            })}
                    </Tbody>
                </Table>)
                :(
                    <div className="form-control text-center"> No Order Found</div>
                )}

                {orders.length > 0 ? (
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
            <div className="modal fade" id="exampleModal1" tabindex="-1" role="dialog" aria-labelledby="exampleModal1" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModal1">Cancel Reason</h5>
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
                            <button type="button" onClick={e => handleCancel(e)} className="btn btn-primary sbtn1">Cancel Doc</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        

    )
}
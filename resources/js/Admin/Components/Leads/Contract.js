import React,{ useState } from 'react'
import { Link } from "react-router-dom";
import Moment from 'moment';

export default function Contract({ contracts , setContracts}) {
    
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Delete Contract!",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .delete(`/api/admin/contract/${id}`, { headers })
                    .then((response) => {
                        Swal.fire(
                            "Deleted!",
                            "Contract has been deleted.",
                            "success"
                        );
                        setTimeout(() => {
                            window.location.reload(true);
                        }, 1000);
                    });
            }
        });
    };

    const copy = [...contracts];
    const [order,setOrder] = useState('ASC');
    const sortTable = (e,col) =>{
        
        let n = e.target.nodeName;

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

        if(order == 'ASC'){
            const sortData = [...copy].sort((a, b) => (a[col] < b[col] ? 1 : -1));
            setContracts(sortData);
            setOrder('DESC');
        }
        if(order == 'DESC'){
            const sortData = [...copy].sort((a, b) => (a[col] < b[col] ? -1 : 1));
            setContracts(sortData);
            setOrder('ASC');
        }
        
    }

  return (
    <div className="boxPanel">
        <div className="table-responsive"> 
        { contracts.length > 0 ?
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Service Name</th>
                        <th>Total Price</th>
                        <th>Date Created</th>
                        <th onClick={(e)=>sortTable(e,'status')} style={{cursor:'pointer'}}>Status  <span className='arr'> &darr; </span></th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    { contracts && contracts.map((c,i)=>{
                          let services = c.offer ? JSON.parse(c.offer.services) : [];

                          let color =  "";         
                          if(c.status == 'un-verified' || c.status == 'not-signed') { color = 'purple' }
                          else if(c.status == 'verified') { color =  'green'}
                          else {color = 'red'}

                        return (
                    <tr>
                        <td>#{c.id}</td>
                        <td>
                            {services && services.map((s,j)=>{
                               
                                return(
                                    (services.length-1 != j) ?
                                        (s.service == '10') ? s.other_title+" | " : 
                                        s.name+" | "
                                    : s.name
                                )
                            })}
                        </td>
                        <td>{ c.offer? c.offer.subtotal : 'NA' } ILS + VAT</td>
                        <td>{Moment(c.created_at).format('MMMM DD, Y')}</td>
                        <td style={{color}}>{ c.status }</td>
                        <td>
                            <div className="d-flex">
                                 { (c.status == 'verified') &&
                                <Link to={`/admin/create-job/${c.id}`} className="btn bg-success mr-2"><i className="fa fa-plus"></i></Link>
                                 }
                                <Link to={`/admin/view-contract/${c.id}`} className="btn bg-yellow"><i className="fa fa-eye"></i></Link>
                                <button className="ml-2 btn bg-red" onClick={() => handleDelete( c.id )}><i className="fa fa-trash"></i></button>                            
                            </div>
                        </td>
                    </tr>    

                        )
                    })}       
                      
                </tbody>
            </table>
            :(
                <div className='form-control text-center'> No contract found</div>
            )
        }
        </div>
    </div>
  )
}

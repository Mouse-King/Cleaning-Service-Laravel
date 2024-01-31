import React,{useState, useEffect} from 'react'
import { Link } from "react-router-dom";
import Sidebar from '../../Layouts/ClientSidebar';
import axios from 'axios';
import ReactPaginate from "react-paginate";
import {Table, Thead, Tbody, Tr, Th, Td} from 'react-super-responsive-table'
import { useTranslation } from 'react-i18next';
import { Base64 } from "js-base64";
import Moment from 'moment'

export default function Contract() {
    
    const[contracts,setContracts] = useState([]);
    const [loading, setLoading] = useState("Loading...");
    const [pageCount, setPageCount] = useState(0);
    const id                        =localStorage.getItem('client-id');
    const {t} = useTranslation();
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("client-token"),
      };
      

    const handlePageClick = async (data) => {
        let currentPage = data.selected + 1;
        axios
            .post("/api/client/contracts?page=" + currentPage,{id:id}, { headers })
            .then((response) => {
                if (response.data.contracts.data.length > 0) {
                    setContracts(response.data.contracts.data);
                    setPageCount(response.data.contracts.last_page);
                } else {
                    setLoading("No contract found");
                }
            });
    };

    const filterContracts = (e) =>{
        axios
        .post(`/api/client/contracts?q=${e.target.value}`,{id:id},{ headers })
        .then((response)=>{
            if (response.data.contracts.data.length > 0) {
                setContracts(response.data.contracts.data);
                setPageCount(response.data.contracts.last_page);
            } else {
                setContracts([]);
                setPageCount(response.data.contracts.last_page);
                setLoading("No contract found");
            }
        });
    }


    const getContract = () => {
        axios
          .post(`/api/client/contracts`,{id:id}, { headers })
          .then((res) => {
            setContracts(res.data.contracts.data);
          })
      }
    useEffect(()=>{
        getContract();
    },[]);

    return (
        <div id="container">
            <Sidebar />
            <div id="content">
                <div className="titleBox customer-title">
                    <div className="row">
                        <div className="col-sm-6">
                            <h1 className="page-title">{t('client.contract.title')}</h1>
                        </div>
                        <div className="col-sm-6">
                            <div className="search-data">
                                <input type='text' className="mr-0 form-control" onChange={filterContracts} placeholder={t('client.search')} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <div className="card-body">
                        <div className="boxPanel">
                            <div className="table-responsive">
                                { contracts.length > 0 ?(
                                <Table className="table table-bordered responsiveTable">
                                    <Thead>
                                        <Tr>
                                            <Th scope="col">{t('client.contract.c_date')}</Th>
                                            <Th scope="col">{t('client.contract.services')}</Th>
                                            <Th scope="col">{t('client.contract.status')}</Th>
                                            <Th scope="col">{t('client.contract.total')}</Th>
                                            <Th scope="col">{t('client.contract.action')}</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>  
                                        {contracts && contracts.map((c,i)=>{

                                            let services = JSON.parse(c.offer.services);

                                            return(

                                        <Tr>
                                            <Td>{Moment(c.created_at).format('D MMM, Y')}</Td>
                                            <Td>
                                            {services && services.map((s,j)=>{
                               
                                                return(
                                                    (services.length-1 != j) ?
                                                    s.name+" | "
                                                    : s.name
                                                )
                                            })}
                                            </Td>
                                            <Td>{ c.status }</Td>
                                            <Td>{ c.offer.total } {t('global.currency')+" "+t('global.vat')}</Td>
                                            <Td>
                                            <Link to={`/client/view-contract/${Base64.encode(c.id.toString())}/${c.unique_hash}`} className="ml-2 btn bg-yellow"><i className="fa fa-eye"></i></Link>
                                            </Td>
                                        </Tr>   

                                            )
                                        })}
                                          
                                    </Tbody>
                                </Table> 
                                ):(
                                    <div className='form-control text-center'>{loading}</div>
                                )
                            }
                            </div>
                            { contracts.length > 0 ?(
                            <ReactPaginate
                                        previousLabel={t('client.previous')}
                                        nextLabel={t('client.next')}
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
                                ): '' }
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    );
}


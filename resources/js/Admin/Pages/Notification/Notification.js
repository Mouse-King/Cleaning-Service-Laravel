import React, { useEffect, useState } from 'react'
import Sidebar from '../../Layouts/Sidebar'
import Moment from 'moment';
import ReactPaginate from "react-paginate";

export default function Notification() {

    const [notices, setNotices] = useState([]);
    const [pageCount, setPageCount] = useState(0);
    const [loading, setLoading] = useState('Loading...');
    const headers = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ` + localStorage.getItem("admin-token"),
    };
    const headNotice = () => {
        axios.post('/api/admin/notice', { all: 1 }, { headers })
            .then((res) => {
                if (res.data.notice.data) {
                    setNotices(res.data.notice.data);
                    setPageCount(res.data.notice.last_page);
                } else {
                    setNotices([]);
                    setLoading('No notification yet');
                }
            })
    }
    const handlePageClick = async (data) => {
        let currentPage = data.selected + 1;
        axios
            .post("/api/admin/notice?page=" + currentPage, { all: 1 }, { headers })
            .then((response) => {
                if (response.data.notice.data) {
                    setNotices(response.data.notice.data);
                    setPageCount(response.data.notice.last_page);
                } else {
                    setLoading('No notification yet');
                }
            });
    };
    const clearAll = (e) => {
        e.preventDefault();
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Delete Notices!",
        }).then((result) => {
            if (result.isConfirmed) {
                axios
                    .post(`/api/admin/clear-notices`, { all: 1 },{ headers })
                    .then((response) => {
                        Swal.fire(
                            "Deleted!",
                            "All notices has been deleted.",
                            "success"
                        );
                        setTimeout(() => {
                           window.location.reload(1);
                        }, 1000);
                    });
            }
        });
    }
    useEffect(() => {
        headNotice();
    }, []);

    return (
        <div id="container">
            <Sidebar />
            <div id="content">
                <div className="titleBox customer-title">
                    <div className="row">
                        <div className="col-sm-6">
                            <h1 className="page-title">Notifications</h1>
                        </div>
                        <div className="col-sm-6">
                            <button onClick={(e) => clearAll(e)} className="btn btn-danger float-right addButton">Clear All</button>
                        </div>
                    </div>
                </div>

                <div className='notification-page'>
                    <div className='card'>
                        <div className='card-body'>
                            {notices.length > 0 ? (

                                notices && notices.map((n, i) => {
                                    return (

                                        <div className="agg-list">
                                            <div className="icons"><i className="fas fa-check-circle"></i></div>
                                            <div className="agg-text">
                                                <h6 dangerouslySetInnerHTML={{ __html: n.data }} />
                                                <p>{Moment(n.created_at).format('DD MMM Y, HH:MM A')}</p>
                                            </div>
                                        </div>

                                    )
                                })

                            )
                                :
                                (<div className='form-control text-center'>{loading}</div>)
                            }

                            {notices.length > 0 ? (
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
                            ) : (
                                <></>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

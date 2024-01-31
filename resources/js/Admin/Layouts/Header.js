import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-link";
import User from '../../Assets/image/user.png';
import { useAlert } from "react-alert";
import MobileHeader from "./MobileHeader";
import Moment from 'moment';
import axios from "axios";

export default function AdminHeader() {
  const alert = useAlert();
  const navigate = useNavigate();
  const [file, setFile] = useState("");
  const [notices, setNotices] = useState([]);
  const [count, setCount] = useState(0);
  const headers = {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    Authorization: `Bearer ` + localStorage.getItem("admin-token"),
  };
  const HandleLogout = (e) => {
    fetch("/api/admin/logout", {
      method: "POST",
      headers: {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "Authorization": `Bearer ` + localStorage.getItem("admin-token"),
      },
    }).then((res) => {
      if (res.status === 200) {
        localStorage.removeItem("admin-token");
        localStorage.removeItem("admin-name");
        localStorage.removeItem("admin-id");
        navigate("/admin/login");
        alert.success("Logged Out Successfully");
      }
    });
  };

  const getSetting = () => {
    axios.get("/api/admin/my-account", { headers }).then((response) => {
      (response.data.account.avatar) ?
        setFile(response.data.account.avatar)
        : setFile(User);

    });
  };

  const headNotice = () => {
    axios.post('/api/admin/notice', { head: 1 }, { headers })
      .then((res) => {
        setNotices(res.data.notice);
        setCount(res.data.count);
      })
  }
  const handleCount = (e) => {
    e.preventDefault();
    axios
      .post(`/api/admin/seen`, { all: 1 }, { headers })
      .then((res) => {
        setCount(0);
      })
  }
  const redirectNotice = (e) => {
    e.preventDefault();
    window.location.href = "/admin/notifications"
  }
  

  useEffect(() => {
    getSetting();
    headNotice();
    setInterval(() =>{
      headNotice();
    }, 10000);
  }, []);


  return (
    <>
      <div className='AdminHeader hidden-xs'>
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-6">
              <h1>Welcome Administrator</h1>
            </div>
            <div className="col-sm-6">
              <div className="float-right d-flex">
                <div className="dropdown notification-bell">
                  {
                    (count != 0 && notices.length > 0) ?
                      <span className="counter">{count}</span>
                      : ''
                  }

                  <button onClick={(e) => handleCount(e)} type="button" className="btn btn-link dropdown-toggle" data-toggle="dropdown">
                    <i className="fas fa-bell"></i>
                  </button>
                  <ul className="dropdown-menu">

                    {notices && notices.map((n, i) => {
                     
                      return (
                        <li onClick={(e) => redirectNotice(e)} className="dropdown-item">
                          <div style={(n.seen == 0) ? { background: "#eee", padding: "2%", cursor: "pointer" } : { padding: "2%", cursor: "pointer" }} className="agg-list">
                            <div className="icons"><i className="fas fa-check-circle"></i></div>
                            <div className="agg-text">
                              <h6 dangerouslySetInnerHTML={{ __html: n.data }} />
                              <p>{Moment(n.created_at).format('DD MMM Y, HH:MM A')}</p>
                            </div>
                          </div>
                        </li>
                      )
                    })}

                    {/* View all notification button */}

                    <li className="dropdown-item">
                      <div className="allNotification">
                        <a style={{ color: "#fff", display: "block" }} href='/admin/notifications' className='btn btn-pink'>See all</a>
                      </div>
                    </li>

                  </ul>

                </div>
                <div className="userToggle dropdown show">
                  <Link className="dropdown-toggle" href="#!" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <img src={file} className='img-fluid' alt='Admin' />
                  </Link>
                  <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                    <Link className="dropdown-item" to="/admin/settings">My Account</Link>
                    <Link className="dropdown-item" onClick={HandleLogout}>Logout</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MobileHeader />
    </>
  )
}

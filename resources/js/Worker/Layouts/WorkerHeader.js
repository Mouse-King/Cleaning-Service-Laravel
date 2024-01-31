import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import User from '../../Assets/image/user.png';
import { useAlert } from "react-alert";
import WorkerMobileHeader from "./WorkerMobileHeader";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
export default function WorkerHeader() {
  const alert = useAlert();
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState("");
  const {t} = useTranslation();
  const HandleLogout = (e) => {
    fetch("/api/logout", {
      method: "POST",
      headers: {
        "Accept": "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "Authorization": `Bearer ` + localStorage.getItem("worker-token"),
      },
    }).then((res) => {
      if (res.status === 200) {
        localStorage.removeItem("worker-token");
        localStorage.removeItem("worker-name");
        localStorage.removeItem("worker-id");
        navigate("/worker/login");
        alert.success("Logged Out Successfully");
      }
    });
  };
  const getAvatar = () => {
    axios
      .get('/api/details', {
        headers: {
          "Accept": "application/json, text/plain, */*",
          "Content-Type": "application/json",
          "Authorization": `Bearer ` + localStorage.getItem("worker-token"),
        }
      })
      .then((res) => {
        //setAvatar(res.data.account.avatar);
        i18next.changeLanguage(res.data.success.lng);
      })
  }
  useEffect(() => {
    getAvatar();
  }, []);

  return (
    <>
      <div className='AdminHeader hidden-xs'>
        <div className="container-fluid">
          <div className="row">
            <div className="col-sm-6">
              <h1>{t('worker.welcome')} {localStorage.getItem("worker-name")}</h1>
            </div>
            <div className="col-sm-6">
              <div className="float-right">
                <div className="dropdown show">
                  <Link className="dropdown-toggle" href="#!" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <img src={User} className='img-fluid' alt='Ajay' />
                  </Link>
                  <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                    <Link className="dropdown-item" to="/worker/my-account">{t('worker.my_account')}</Link>
                    <Link className="dropdown-item" onClick={HandleLogout}>{t('worker.logout')}</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <WorkerMobileHeader />
    </>
  )
}

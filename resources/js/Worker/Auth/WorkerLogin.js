import React, { useState } from "react";
import logo from "../../Assets/image/sample.svg";
import i18next from "i18next";
export default function Login() {
    const [worker, setWorker] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState([]);

    const HandleLogin = (e) => {
        e.preventDefault();
        const data = {
            worker_id: worker,
            password: password,
        };
        axios.post(`/api/login`, data).then((result) => {
            if (result.data.errors) {
                setErrors(result.data.errors);
            } else {
                localStorage.setItem("worker-token", result.data.token);
                i18next.changeLanguage(result.data.lng);
                localStorage.setItem(
                    "worker-name",
                    result.data.firstname + " " + result.data.lastname
                );
                localStorage.setItem("worker-id", result.data.id);

                    window.location = "/worker/dashboard";
            }
        });
    };
  
    return (
        <div>
            <div id="loginPage">
                <div className="container adminLogin">
                    <div className="formSide">
                        <div className="hidden-xs ifRTL">
                            <svg width="333" height="135" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">       
                                <image xlinkHref={logo} width="333" height="135"></image>
                            </svg>
                        </div>
                        <div className="hidden-xl ifRTL">
                            <svg width="250" height="94" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">       
                                <image xlinkHref={logo} width="250" height="94"></image>
                            </svg>
                        </div>
                        <h1 className="page-title">Worker Login</h1>
                        <form>
                            <div className="form-group">
                                <div className="input-group mt-2">
                                    <div className="input-group-prepend">
                                        <span
                                            className="input-group-text"
                                            id="basic-addon1"
                                        >
                                            <i className="fa-solid fa-user"></i>
                                        </span>
                                    </div>
                                    <input
                                        type="text"
                                        name="email"
                                        className="form-control"
                                        placeholder="Enter Worker id or Email"
                                        onChange={(e) =>
                                            setWorker(e.target.value)
                                        }
                                    />
                                </div>
                                {errors.worker ? (
                                    <small className="text-danger mb-1">
                                        {errors.worker}
                                    </small>
                                ) : (
                                    ""
                                )}
                            </div>
                            <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <span
                                            className="input-group-text"
                                            id="basic-addon1"
                                        >
                                            <i className="fa-solid fa-key"></i>
                                        </span>
                                    </div>
                                    <input
                                        type="password"
                                        name="password"
                                        className="form-control"
                                        placeholder="Enter password"
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />
                                </div>
                                {errors.password ? (
                                    <small className="text-danger mb-1">
                                        {errors.password}
                                    </small>
                                ) : (
                                    ""
                                )}
                            </div>
                            <div className="form-group mt-4">
                                <button
                                    as="input"
                                    type="submit"
                                    className="btn btn-danger btn-block"
                                    onClick={HandleLogin}
                                    Login
                                > Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

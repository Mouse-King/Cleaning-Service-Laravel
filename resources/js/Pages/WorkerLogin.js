import React, { useState } from "react";
import logo from ".././Assets/image/sample.svg";

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
                localStorage.setItem(
                    "worker-name",
                    result.data.firstname + " " + result.data.lastname
                );
                localStorage.setItem("worker-id", result.data.id);

                    window.location = "/worker/dashboard";
            }
        });
    };
    const onChange = (value) => {
        console.log("Captcha value:", value);
    };

    return (
       
           <div id="loginPage">
            <div className="container adminLogin">
                <div className="formSide"> 
                    <svg width="250" height="94" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">       
                        <image xlinkHref={logo} width="250" height="94"></image>
                    </svg>
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
                                    type="email"
                                    className="form-control"
                                    onChange={(e) =>
                                        setWorker(e.target.value)
                                    }
                                    placeholder="Username"
                                    name="username"
                                    aria-label="Username"
                                />
                            </div>
                            {errors.email ? (
                                <small className="text-danger mb-1">
                                    {errors.email}
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
                                    className="form-control"
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Password"
                                    name="password"
                                    aria-label="Password"
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
                        <div className="form-group">
                            <ul className="list-inline">
                                <li>
                                    <label>
                                        <input type="checkbox" />{" "}
                                        Remember me{" "}
                                    </label>
                                </li>
                            </ul>
                        </div>
                        <div className="form-group mt-4">
                            <button
                                type="button"
                                className="btn btn-danger btn-block"
                                onClick={HandleLogin}
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
